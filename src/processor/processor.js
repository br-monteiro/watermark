const log = require('bole')('processor/processor')
const knex = require('../database/knex')
const inputSchema = require('../schemes/input.json')

const { validator } = require('../validator')
const { safeArray, buildSynchronizedItem } = require('../utils')
const { createDirInStatic, fileExists } = require('../file-manager')
const { fetchFile, saveOnBucket } = require('../aws/bucket-manager')
const { joinImges, makeThumbnail } = require('../image-processor')

/**
 * Init the queue to proccess
 * @param { Array<InputValue> } values - The value of request
 * @return { Array<Promise<QueueItem>> }
 */
async function initQueue (values) {
  /**
   * @type { Array<Promise<QueueItem>> }
   */
  const promises = safeArray(values)
    .map(async item => {
      const result = {
        transactionId: item.transactionId,
        status: 'queued'
      }

      if (!validator.validate(item, inputSchema)) {
        result.status = 'error'
        result.details = validator
          .getErrors()
          .map(_ => ({ error: _.message, path: _.path }))

        log.error(result.details, 'error to process item')
      } else {
        const isQueued = await insertQueueItem(item)

        if (!isQueued) {
          result.status = 'error'
          result.details = [{ error: 'error to insert the item into the queue' }]
        }
      }

      return result
    })

  return Promise
    .all(promises)
    .then(data => {
      if (data.some(item => item.status === 'queued')) {
        initProcessor()
      }
      return data
    })
}

/**
 * Insert the item into database queue
 * @param { InputValue } item - Item of request
 * @return { Boolean }
 */
async function insertQueueItem (item) {
  try {
    return await knex.transaction(async trx => {
      const ids = await knex('queue')
        .insert({
          status: 'queued',
          transaction_id: item.transactionId,
          feedback_url: item.feedbackUrl,
          watermark_path: item.watermarkPath
        }, 'id')
        .transacting(trx)

      await knex('queue_items')
        .insert(item.images.map(image => {
          return {
            queue_id: ids[0],
            status: 'queued',
            post_id: image.postId,
            position_x: image.positions.x,
            position_y: image.positions.y,
            position_height: image.positions.height,
            position_width: image.positions.width,
            base_image_path: image.baseImagePath,
            s3_image_path: image.s3ImagePath,
            details: ''
          }
        }))
        .transacting(trx)

      return true
    })
  } catch (error) {
    log.error(error.sqlMessage || error.message, 'error to insert item into queue')
    return false
  }
}

/**
 * Run the process of images
 * @param { boolean } forceProcess - Indicate whether the process will be forced
 * @param { Status } queueStatus - The status value of queue
 * @param { Status } queueItemStatus - The status value of queue_items
 */
async function initProcessor (forceProcess = false, queueStatus = 'queued', queueItemStatus = 'queued') {
  let result = []

  try {
    const queue = await knex('queue')
      .first()
      .where(knex.raw('?? = ?', ['queue.status', queueStatus]))

    if (queue && queue.id) {
      const queueItems = await knex('queue_items')
        .where(knex.raw(':status: = :statusValue AND :queueId: = :queueIdValue', {
          status: 'queue_items.status',
          statusValue: queueItemStatus,
          queueId: 'queue_items.queue_id',
          queueIdValue: queue.id
        }))

      result = buildSynchronizedItem(queue, queueItems)

      if (result.length) {
        await changeQueueStatus(queue.id, 'processing')
      }

      for (let i = 0; i < queueItems.length; i++) {
        try {
          result = await changesItemsStatus(result, 'processing')
          result = await syncLocalFiles(result, forceProcess)
          result = await processImages(result)
          result = await processImagesThumb(result)
          result = await syncRemoteFiles(result)
        } catch (error) {
          log.error(error.message, 'UNEXPECTED ERROR PROCESSING')
          continue
        }
      }
    }
  } catch (error) {
    log.error(error.message, 'error to process queue')
  }

  // execute the process until returns a empty list to process
  if (result.length) {
    messenger(result)
    const verifiedQueueItemStatus = queueItemStatus !== 'processed' ? queueItemStatus : 'queued'
    await initProcessor(forceProcess, queueStatus, verifiedQueueItemStatus)
  }
}

/**
 * Check if the all files was downloaded from S3.
 * If there's no file, performs a download of file from S3
 * @param { Array<SynchronizedItem> } items - The items with pre-processing of synchronizer files
 * @param { boolean } forceProcess - Indicate whether the process will be forced
 * @return { Array<SynchronizedItem> }
 */
async function syncLocalFiles (items, forceProcess = false) {
  const transactionId = items && items[0] && items[0].transactionId
  await createDirInStatic(transactionId)

  return Promise.all(items.map(async item => {
    if (!fileExists(item.watermark.fullPath) || forceProcess) {
      const isWatermarkSynchronized = await fetchFile(item.watermark.bucket, item.watermark.fileName, item.watermark.fullPath)

      if (!isWatermarkSynchronized) {
        const errorWatermark = `Error: could not download the file: ${item.watermark.fileName}`
        item.details.push(errorWatermark)
        log.error(errorWatermark)
        item.status = 'error'
        await changeQueueItemStatus(item.queueItemId, 'error')
      }
    }

    if (!fileExists(item.baseImage.fullPath) || forceProcess) {
      const isBaseImageSynchronized = await fetchFile(item.baseImage.bucket, item.baseImage.fileName, item.baseImage.fullPath)

      if (!isBaseImageSynchronized) {
        const errorBaseImage = `Error: could not download the file: ${item.baseImage.fileName}`
        item.details.push(errorBaseImage)
        log.error(errorBaseImage)
        item.status = 'error'
        await changeQueueItemStatus(item.queueItemId, 'error')
      }
    }

    return item
  })).then(data => data)
}

/**
 * Process the images to attache the stamps
 * @param { Array<SynchronizedItem> } items - The items with pre-processing of synchronizer files
 * @return { Array<SynchronizedItem> }
 */
async function processImages (items) {
  return Promise.all(items.map(async item => {
    if (item.status === 'error') {
      return item
    }

    const isProcessed = await joinImges(item.baseImage.fullPath, item.watermark.fullPath, item.s3Image.fullPath, item)

    if (!isProcessed) {
      item.status = 'error'
      item.details.push(`Error: could not process image: ${item.baseImage.fileName}`)
      log.error(item.details)
      await changeQueueItemStatus(item.queueItemId, 'error')
    }

    return item
  })).then(data => data)
}

/**
 * Process the thumbnail images
 * @param { Array<SynchronizedItem> } items - The items with pre-processing of synchronizer files
 * @return { Array<SynchronizedItem> }
 */
async function processImagesThumb (items) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].status !== 'error') {
      await makeThumbnail(items[i].s3Image.fullPath, items[i].s3Image.fullPathThumbnail)
    }
  }

  return items
}

/**
 * Sync the processed images with S3
 * @param { Array<SynchronizedItem> } items - The items with pre-processing of synchronizer files
 * @return { Array<SynchronizedItem> }
 */
async function syncRemoteFiles (items) {
  return Promise.all(items.map(async item => {
    if (item.status === 'error') {
      return item
    }

    const isSynchronized = await saveOnBucket(item.s3Image.bucket, item.s3Image.fullPath)
    await saveOnBucket(item.s3Image.bucket, item.s3Image.fullPathThumbnail)

    if (!isSynchronized) {
      item.status = 'error'
      item.details.push(`Error: could not upload image: ${item.s3Image.fileName}`)
      log.error(item.details)
      await changeQueueItemStatus(item.queueItemId, 'error')
    }

    return item
  })).then(data => data)
}

/**
 * Changes the status to 'processing'
 * @param { Array<SynchronizedItem> } items - The items with pre-processing of synchronizer files
 * @param { Status } status - The status value
 * @return { Array<SynchronizedItem> }
 */
async function changesItemsStatus (items, status) {
  return Promise.all(items.map(async item => {
    await changeQueueItemStatus(item.queueItemId, status)
    return item
  })).then(data => data)
}

/**
 * Dispatcher the messages to feedbackUrls
 * @param { Array<SynchronizedItem> } items - The items with pre-processing of synchronizer files
 */
function messenger (items) {
  const processedBody = items.reduce(async (body, item) => {
    if (!body[item.transactionId]) {
      body[item.transactionId] = {}
      await changeQueueStatus(item.queueId, 'processed')
    }

    if (item.status !== 'error') {
      await changeQueueItemStatus(item.queueItemId, 'processed')
    }

    body[item.transactionId] = {
      transactionId: item.transactionId,
      feedbackUrl: item.feedbackUrl,
      images: body[item.transactionId].images || []
    }

    body[item.transactionId].images.push({
      postId: item.postId,
      status: item.status
    })

    return body
  }, {})

  processedBody
    .then(data => updateItemsStatus(Object.values(data)))
    .catch(error => log.error(error, 'Could not dispatch the message to feedbackURL'))
}

/**
 * Changes the status value in table name
 * @param { number } id - The id of register
 * @param { string } tableName - The table name
 * @param { Status } status - The status value
 * @return { Promise<Boolean> }
 */
async function abstractChangeStatus (id, tableName, status) {
  try {
    await knex(tableName)
      .where('id', '=', id)
      .update({ status })

    return true
  } catch (error) {
    log.error(error, `Error: could not change the status for: ${tableName}`)
    return false
  }
}

/**
 * Changes the status of queue
 * @param { number } id - The id of register
 * @param { Status } status - The status value
 * @return { Promise<Boolean> }
 */
async function changeQueueStatus (id, status) {
  return abstractChangeStatus(id, 'queue', status)
}

/**
 * Changes the status of queue_items
 * @param { number } id - The id of register
 * @param { Status } status - The status value
 * @return { Promise<Boolean> }
 */
async function changeQueueItemStatus (id, status) {
  return abstractChangeStatus(id, 'queue_items', status)
}

/**
 * Update items status direct in database
 * @param { Array<ProcessedBody> } items
 */
function updateItemsStatus (items) {
  items.forEach(async item => {
    const trx = await knex.transaction()
    try {
      let purchaseStatus = 'success'
      const updatePurchaseStatus = item.images.map(item => {
        if (item.status === 'error') {
          purchaseStatus = 'error'
        }

        return trx('Purchase_posts')
          .where({ id: item.postId })
          .update({ watermark_status: item.status })
      })

      const purchaseUpdate = trx('Purchases')
        .where({ id: item.transactionId })
        .update({ watermark_status: purchaseStatus })

      updatePurchaseStatus.push(purchaseUpdate)

      await Promise.all(updatePurchaseStatus)
      trx.commit()
    } catch (err) {
      log.error(err)
      trx.rollback()
    }
  })
}

module.exports = {
  initQueue,
  initProcessor
}
