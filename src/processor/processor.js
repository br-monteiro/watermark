
const log = require('bole')('processor/processor')
const knex = require('../database/knex')
const { validator } = require('../validator')
const { safeArray, getUrlDetails } = require('../utils')
const inputSchema = require('../schemes/input.json')
const { createDirInStatic, fileExists, basename, pathname, buildThumbnailPath } = require('../file-manager')
const { fetchFile, saveOnBucket } = require('../aws/bucket-manager')
const { joinImges, makeThumbnail } = require('../image-processor')
const { staticPaths } = require('../config')
const http = require('http')

/**
 * Init the queue to proccess
 * @param { Array<InputValue> } values - The value of request
 * @return { Array<Promise<QueueItem>> }
 */
async function initQueue (values) {
  const promises = safeArray(values)
    .map(async item => {
      const result = {
        id: item.transactionId,
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
      initProcessor()
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
 */
async function initProcessor (forceProcess = false, queueStatus = 'queued', queueItemStatus = 'queued') {
  let lastQueueId = null
  const queue = await knex('queue')
    .where(knex.raw('?? = ?', ['queue.status', queueStatus]))

  Promise.all(queue.map(async queueItem => {
    const queueItems = await knex('queue_items')
      .where(knex.raw(':status: = :statusValue AND :queueId: = :queueIdValue', {
        status: 'queue_items.status',
        statusValue: queueItemStatus,
        queueId: 'queue_items.queue_id',
        queueIdValue: queueItem.id
      }))

    let result = buildSynchronizedItem(queueItem, queueItems)

    // update status of queue
    if (lastQueueId !== queueItem.id) {
      await changeQueueStatus(queueItem.id, 'processing')
      lastQueueId = queueItem.id
    }

    result = await changesItemsStatus(result, 'processing')
    result = await syncLocalFiles(result, forceProcess)
    result = await processImages(result)
    result = await processImagesThumb(result)
    result = await syncRemoteFiles(result)

    return result
  }))
    .then(data => messenger(data.map(item => item[0])))
    .catch(error => {
      log.error(error.message, 'error to process queue')
    })
}

/**
 * Build the FileDetials object
 * @param { string } value - The path of file
 * @param { strint } basePath - The base path
 * @return { FileDetails }
 */
function buildFileDatails (value, basePath = '') {
  const baseName = basename(value)
  const fullPath = `${basePath}${baseName}`
  return {
    rawValue: value,
    bucket: pathname(value),
    fullPath,
    fullPathThumbnail: buildThumbnailPath(fullPath),
    fileName: baseName
  }
}

/**
 * Check if the all files was downloaded from S3.
 * If there's no file, performs a download of file from S3
 * @param { QueueDatabaseRow } queue - The item of queue
 * @param { Array<QueueItemsDatabaseRow>} queueItems - The items related of queue
 * @return { Array<SynchronizedItem> }
 */
function buildSynchronizedItem (queue, queueItems) {
  return queueItems.map(item => {
    return {
      queueId: queue.id,
      queueItemId: item.id,
      transactionId: queue.transaction_id,
      feedbackUrl: queue.feedback_url,
      x: item.position_x,
      y: item.position_y,
      height: item.position_height,
      width: item.position_width,
      status: 'success',
      details: [],
      watermark: buildFileDatails(queue.watermark_path, `${staticPaths.input}${queue.transaction_id}/`),
      baseImage: buildFileDatails(item.base_image_path, `${staticPaths.input}${queue.transaction_id}/`),
      s3Image: buildFileDatails(item.s3_image_path, `${staticPaths.output}${queue.transaction_id}/`)
    }
  })
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
  return Promise.all(items.map(async item => {
    if (item.status === 'error') {
      return item
    }

    await makeThumbnail(item.s3Image.fullPath, item.s3Image.fullPathThumbnail)

    return item
  })).then(data => data)
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
 * @param { 'queued' | 'error' | 'processing' | 'processed' } status - The status value
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
@param { Array<SynchronizedItem> } items - The items with pre-processing of synchronizer files
 */
function messenger (items) {
  let lastQueueId = null
  items
    .forEach(async item => {
      if (item.status !== 'error') {
        await changeQueueItemStatus(item.queueItemId, 'processed')
        if (lastQueueId !== item.queueId) {
          await changeQueueStatus(item.queueId, 'processed')
          lastQueueId = item.queueId
        }
      }
      dispatchMessage(item)
    })
}

/**
 * Changes the status value in table name
 * @param { number } id - The id of register
 * @param { string } tableName - The table name
 * @param { 'queued' | 'error' | 'processing' | 'processed' } status - The status value
 * @return { Promise<Boolean> }
 */
async function asbtracChangeStatus (id, tableName, status) {
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
 * @param { 'queued' | 'error' | 'processing' | 'processed' } status - The status value
 * @return { Promise<Boolean> }
 */
async function changeQueueStatus (id, status) {
  return asbtracChangeStatus(id, 'queue', status)
}

/**
 * Changes the status of queue_items
 * @param { number } id - The id of register
 * @param { 'queued' | 'error' | 'processing' | 'processed' } status - The status value
 * @return { Promise<Boolean> }
 */
async function changeQueueItemStatus (id, status) {
  return asbtracChangeStatus(id, 'queue_items', status)
}

/**
 * Try to performs a request to feedbackURL
 * @param { SynchronizedItem } item
 */
function dispatchMessage (item) {
  const data = JSON.stringify({
    queueId: item.queueId,
    queueItemId: item.queueItemId,
    status: item.status,
    s3ImagePath: item.s3Image.rawValue,
    details: item.details
  })

  const urlDetails = getUrlDetails(item.feedbackUrl)

  const options = {
    hostname: urlDetails.hostname,
    port: urlDetails.port,
    path: `${urlDetails.pathname}${urlDetails.search}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  const req = http.request(options)
  req.on('error', (error) => {
    log.error(error, 'Error: could not be fire a request')
  })
  req.write(data)
  req.end()
}

module.exports = {
  initQueue,
  initProcessor
}
