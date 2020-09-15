
const log = require('bole')('processor/processor')
const knex = require('../database/knex')
const { validator } = require('../validator')
const { safeArray } = require('../utils')
const inputSchema = require('../schemes/input.json')

/**
 * @typedef InputValue
 * @property { String } id
 * @property { String } feedbackUrl
 * @property { String } baseImagePath
 * @property { InputValuePositions} positions
 * @property { InputValueOptions} watermarkOptions
 */

/**
 * @typedef InputValuePositions
 * @property { Number } x
 * @property { Number } y
 * @property { Number } height
 * @property { Number } width
 */

/**
 * @typedef InputValueOptions
 * @property { 'text' | 'image' } type
 * @property { InputValueDetails } details
 */
/**
 * @typedef InputValueDetails
 * @property { String } [text]
 * @property { Number } [size]
 * @property { String } [color]
 * @property { String } [path]
 */

/**
 * @typedef QueueItemDetail
 * @param { String } error
 */

/**
 * @typedef QueueItem
 * @property { String } id
 * @property { 'queued' | 'error' } status
 * @property { Array<QueueItemDetail> } [details]
 */

/**
 * Init the queue to proccess
 * @param { Array<InputValue> } values - The value of request
 * @return { Array<Promise<QueueItem>> }
 */
async function initQueue (values) {
  const promises = safeArray(values)
    .map(async item => {
      const result = {
        id: item.id,
        status: 'queued'
      }

      if (!validator.validate(item, inputSchema)) {
        result.status = 'error'
        result.details = validator
          .getErrors()
          .map(_ => ({ error: _.message }))
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
    const date = new Date()

    await knex('queue')
      .insert({
        status: 'queued',
        attempt: 1,
        created_at: date,
        updated_at: date,
        item_id: item.id,
        feedback_url: item.feedbackUrl,
        base_image_path: item.baseImagePath,
        type: item.watermarkOptions.type,
        details_text: item.watermarkOptions.details.text,
        details_size: item.watermarkOptions.details.size,
        details_color: item.watermarkOptions.details.color,
        details_path: item.watermarkOptions.details.path,
        position_x: item.positions.x,
        position_y: item.positions.y,
        position_height: item.positions.height,
        position_width: item.positions.width
      })

    return true
  } catch (error) {
    log.error(error.sqlMessage, 'error to insert item into queue')
    return false
  }
}

function initProcessor () {
  // todo
}

module.exports = {
  initQueue
}
