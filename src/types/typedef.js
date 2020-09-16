/**
 * @typedef InputValue
 * @property { String } transactionId
 * @property { String } feedbackUrl
 * @property { String } watermarkPath
 * @property { Array<ImageDetails> } images
 */

/**
 * @typedef ImageDetails
 * @property { ImagePositions } positions
 * @property { String } baseImagePath
 * @property { String } s3ImagePath
 */

/**
 * @typedef ImagePositions
 * @property { Number } x
 * @property { Number } y
 * @property { Number } height
 * @property { Number } width
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
 * @param { String } path
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
