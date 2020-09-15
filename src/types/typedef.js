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
 * @typedef InputSchemaError
 * @property { String } message
 * @property { String } path
 */
