const log = require('bole')('aws/bucket-manager')
const fileManager = require('../file-manager')
const s3 = require('./s3')

/**
 * Save the file from S3 bucket in local file system
 * @param { string } bucket - The bucket name
 * @param { string } filename - The file name on bucket
 * @param { string } destination - The file name to be saved
 * @return { Promise<Boolean> }
 */
async function fetchFile (bucket, filename, destination) {
  if (!await fileExistsInS3(bucket, filename)) {
    return Promise.resolve(false)
  }

  return new Promise(resolve => {
    try {
      const fileStream = fileManager.writeStream(destination)
      const s3Stream = s3
        .getObject({ Bucket: bucket, Key: filename })
        .createReadStream()

      s3Stream
        .on('error', err => {
          log.error(err, '[1]error occur while fetch file')
          resolve(false)
        })

      s3Stream
        .pipe(fileStream)
        .on('error', err => {
          log.error(err, '[2]error occur while fetch file')
          resolve(false)
        })
        .on('close', async () => {
          resolve(true)
        })
    } catch (error) {
      log.error(error, '[3]error occur while fetch file')
      resolve(false)
    }
  })
}

/**
 * Check if the file exists in S3
 * @param { string } bucket - The bucket name
 * @param { string } filename - The file name on bucket
 * @return { Promise<Boolean> }
 */
async function fileExistsInS3 (bucket, filename) {
  try {
    await s3.headObject({ Bucket: bucket, Key: filename }).promise()
    return true
  } catch (error) {
    log.error(error, `there's no file in S3: ${filename}`)
    return false
  }
}

/**
 * Save the file from local file system in S3 bucket
 * @param { string } bucket - The bucket name
 * @param { string } filename - The file name
 * @return { Promise<Boolean> }
 */
function saveOnBucket (bucket, filename) {
  return new Promise(resolve => {
    const uploadParams = { Bucket: bucket, Key: '', Body: '' }
    const fileStream = fileManager.readStream(filename)

    fileStream.on('error', err => {
      log.error(err, 'error occur while stream the file')
    })

    uploadParams.Body = fileStream
    uploadParams.Key = fileManager.basename(filename)

    s3.upload(uploadParams, (err, data) => {
      if (err) {
        log.error(err, 'error occur while upload the file')
        resolve(false)
      } if (data) {
        resolve(true)
      }
    })
  })
}

module.exports = {
  fetchFile,
  saveOnBucket
}
