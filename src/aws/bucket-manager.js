const log = require('bole')('aws/bucket-manager')
const fileManager = require('../file-manager')
const s3 = require('./s3')

/**
 * Save the file from S3 bucket in local file system
 * @param { string } bucket - The bucket name
 * @param { string } filename - The file name
 * @return { Promise<Boolean> }
 */
function fetchFile (bucket, filename) {
  return new Promise((resolve) => {
    try {
      const fileStream = fileManager.writeStream(filename)
      var s3Stream = s3
        .getObject({ Bucket: bucket, Key: filename })
        .createReadStream()

      s3Stream.on('error', err => {
        throw new Error(err)
      })

      s3Stream
        .pipe(fileStream)
        .on('error', err => {
          throw new Error(err)
        })
        .on('close', () => {
          resolve(true)
        })
    } catch (error) {
      log.error(error, 'error occur while fetch file')
      resolve(false)
    }
  })
}

/**
 * Save the file from local file system in S3 bucket
 * @param { string } bucket - The bucket name
 * @param { string } filename - The file name
 * @return { Promise<Boolean> }
 */
function saveOnBucket (bucket, filename) {
  return new Promise((resolve) => {
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
