
const { validator } = require('../validator')
const { safeArray } = require('../utils')
const inputSchema = require('../schemes/input.json')

/**
 * @typedef InputValue
 * @property { String } id
 * @property { String } groupId
 */

/**
 * @typedef QueueItemDetail
 * @param { String } error
 */

/**
 * @typedef QueueItem
 * @property { String } id
 * @property { String } groupId
 * @property { 'queued' | 'error' } status
 * @property { Array<QueueItemDetail> } [details]
 */

/**
 * Init the queue to proccess
 * @param { Array<InputValue> } values - The value of request
 * @return { Array<QueueItem> }
 */
function initQueue (values) {
  return safeArray(values)
    .reduce((data, item) => {
      const controller = `${item.groupId}-${item.id}`

      if (!data.controller.includes(controller)) {
        const result = {
          id: item.id,
          groupId: item.groupId,
          status: 'queued'
        }

        if (!validator.validate(item, inputSchema)) {
          result.status = 'error'
          result.details = validator
            .getErrors()
            .map(_ => ({ error: _.message }))
        }

        // TODO: add a real queue implementation

        data.controller.push(controller)
        data.result.push(result)
      }

      return data
    }, { result: [], controller: [] }).result
}

module.exports = {
  initQueue
}
