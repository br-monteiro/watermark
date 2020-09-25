const { staticPaths } = require('../config')
const fs = require('fs')
const path = require('path')

/**
 * Check if the file exists
 * @param { string } filename - The file name
 * @return { Boolean }
 */
function fileExists (filename) {
  if (!filename || typeof filename !== 'string') {
    return false
  }

  try {
    return fs.existsSync(filename)
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

  return fs.createWriteStream(filename)
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

  return fs.createReadStream(filename)
}

/**
 * Return the last portion of a path
 * Similar to the Unix basename command
 * Often used to extract the file name from a fully qualified path
 * @param { string } filename - The file name
 * @return { string }
 */
function basename (filename) {
  return filename && typeof filename === 'string'
    ? path.basename(filename)
    : undefined
}

/**
 * Returns the path without file name
 * @param { string } filename - The file name
 * @return { string }
 */
function pathname (filename) {
  if (!filename || typeof filename !== 'string') {
    return
  }

  const chunks = filename.split('/')

  if (chunks.length === 1) {
    return filename
  }

  delete chunks[chunks.length - 1]

  return chunks.join('/')
}

/**
 * Create one directory in static/input and static/output
 * @param { string } directoryName - The name of directory
 * @return { boolean }
 */
async function createDirInStatic (directoryName) {
  try {
    fs.mkdirSync(`${staticPaths.input}${directoryName}`, { recursive: true })
    fs.mkdirSync(`${staticPaths.output}${directoryName}`, { recursive: true })
    return true
  } catch (_) {
    return false
  }
}

/**
 * Returns the filename with prefix
 * @param { string } filename - The full path of file
 * @param { string } prefix - The prefix of file
 * @return { string }
 */
function buildThumbnailPath (filename, prefix = 'thumb-') {
  const prefixFileName = `${prefix}${basename(filename)}`
  return filename.replace(new RegExp(basename(filename) + '$'), prefixFileName)
}

module.exports = {
  fileExists,
  writeStream,
  readStream,
  basename,
  pathname,
  buildThumbnailPath,
  createDirInStatic
}
