
const log = require('bole')('processor/processor')
const knex = require('../database/knex')
const { validator } = require('../validator')
const { safeArray } = require('../utils')
const inputSchema = require('../schemes/input.json')

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

function initProcessor () {
  // todo
}

module.exports = {
  initQueue
}
