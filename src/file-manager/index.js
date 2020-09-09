const { staticPaths } = require('../config')
const fs = require('fs')
const path = require('path')

/**
 * Check if the file exists in the static/input directory
 * @param { string } filename - The file name
 * @return { Boolean }
 */
function fileExists (filename) {
  if (!filename || typeof filename !== 'string') {
    return false
  }

  try {
    return fs.existsSync(`${staticPaths.input}${filename}`)
  } catch (_) {
    return false
  }
}

/**
 * Create a new `WriteStream` object and return it
 * @param { string } filename - The file name
 * @return { fs.WriteStream }
 * @throws Error
 */
function writeStream (filename) {
  if (!filename || typeof filename !== 'string') {
    throw new Error('The `path` must to be a valid string')
  }

  return fs.createWriteStream(`${staticPaths.output}${filename}`)
}

/**
 * Create a new `ReadStream` object and return it
 * @param { string } filename - The file name
 * @return { fs.ReadStream }
 * @throws Error
 */
function readStream (filename) {
  if (!filename || typeof filename !== 'string') {
    throw new Error('The `path` must to be a valid string')
  }

  return fs.createReadStream(`${staticPaths.output}${filename}`)
}

/**
 * Return the last portion of a path.
 * Similar to the Unix basename command.
 * Often used to extract the file name from a fully qualified path.
 * @param { string } filename - The file name
 * @return { string }
 */
function basename (filename) {
  return filename && typeof filename === 'string'
    ? path.basename(`${staticPaths.output}${filename}`)
    : undefined
}

module.exports = {
  fileExists,
  writeStream,
  readStream,
  basename
}
