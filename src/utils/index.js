const { staticPaths } = require('../config')
const { basename, pathname, buildThumbnailPath } = require('../file-manager')

/**
 * Always provide an array. If the 'value' is an array, return it.
 * Otherwaise returs an empty array
 * @param { * } value - The value to be checked
 * @return { Array }
 */
function safeArray (value) {
  return Array.isArray(value) ? value : []
}

/**
 * Returns the details from URL
 * @param { string } url - The URL
 * @return { URLDetail }
 */
function getUrlDetails (url) {
  if (!url || typeof url !== 'string') {
    return
  }

  const { hostname, protocol, port, pathname, search } = new URL(url)

  return {
    hostname,
    protocol,
    port: Number(port) || 80,
    pathname,
    search
  }
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

module.exports = {
  safeArray,
  getUrlDetails,
  buildSynchronizedItem
}
