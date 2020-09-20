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

/**
 * @typedef QueueDatabaseRow
 * @property { Number } id
 * @property { 'queued' | 'processing' | 'processed' | 'error' } status
 * @property { String } transaction_id
 * @property { String } feedback_url
 * @property { String } watermark_path
 */

/**
 * @typedef QueueItemsDatabaseRow
 * @property { Number } id
 * @property { Number } queue_id
 * @property { 'queued' | 'processing' | 'processed' | 'error' } status
 * @property { Number } position_x
 * @property { Number } position_y
 * @property { Number } position_height
 * @property { Number } position_width
 * @property { String } base_image_path
 * @property { String } s3_image_path
 * @property { String } details
 */

/**
 * @typedef FileDetails
 * @property { String } bucket
 * @property { String } fullPath
 * @property { String } fileName
 * @property { Boolean } downloaded
 * @property { Boolean } uploaded
 * @property { String } details
 */

/**
 * @typedef SynchronizedItem
 * @property { String } transactionId
 * @property { String } feedbackUrl
 * @property { FileDetails } watermark
 * @property { Number } x
 * @property { Number } y
 * @property { Number } height
 * @property { Number } width
 * @property { FileDetails } baseImage
 * @property { FileDetails } s3Image
 * @property { 'success' | 'error' } status
 * @property { Array<String> } details
 */
