/**
 * @typedef { 'queued' | 'error' | 'processing' | 'processed' } Status
 */

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
 * @property { String } postId
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
 * @property { String } transactionId
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
 * @property { Status } status
 * @property { String } transaction_id
 * @property { String } feedback_url
 * @property { String } watermark_path
 */

/**
 * @typedef QueueItemsDatabaseRow
 * @property { Number } id
 * @property { Number } queue_id
 * @property { Status } status
 * @property { Number } position_x
 * @property { Number } position_y
 * @property { Number } position_height
 * @property { Number } position_width
 * @property { String } post_id
 * @property { String } base_image_path
 * @property { String } s3_image_path
 * @property { String } details
 */

/**
 * @typedef FileDetails
 * @property { String } rawValue
 * @property { String } bucket
 * @property { String } fullPath
 * @property { String } fullPathThumbnail
 * @property { String } fileName
 */

/**
 * @typedef SynchronizedItem
 * @property { Number } queueId
 * @property { Number } queueItemId
 * @property { String } transactionId
 * @property { String } postId
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

/**
 * @typedef URLDetail
 * @property { String } hostname
 * @property { String } protocol
 * @property { Number } port
 * @property { String } pathname
 * @property { String } search
 */

/**
 * @typedef ProcessedBody
 * @property { String } transactionId
 * @property { String } feedbackUrl
 * @property { Array<ProcessedBodyImage> } images
 */

/**
 * @typedef ProcessedBodyImage
 * @property { String } postId
 * @property { 'success' | 'error' } status
 */
