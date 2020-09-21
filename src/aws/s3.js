const config = require('../config')

/**
 * @type { import('aws-sdk').S3 }
 */
let s3

if (config.env.PRD) {
  const AWS = require('aws-sdk')
  AWS.config.update(config.aws)
  s3 = new AWS.S3({ apiVersion: '2006-03-01' })
} else {
  const AWSMock = require('mock-aws-s3')
  AWSMock.config.basePath = config.bucketBase
  s3 = AWSMock.S3({
    params: { }
  })
}

module.exports = s3
