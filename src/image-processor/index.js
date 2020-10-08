const sharp = require('sharp')
const log = require('bole')('image-processor')

/**
 * Join two images according positions
 * @param { string } imageA - The image name
 * @param { string } imageB - The image name
 * @param { string } destination - The image generated destination
 * @param { ImagePositions } positions - The positions to join the image 'B'
 * @return { Promise<Boolean> }
 */
async function joinImges (imageA, imageB, destination, positions) {
  if (
    !imageA ||
    !imageB ||
    !destination ||
    !positions
  ) {
    log.error('error with parameters')
    return false
  }

  return sharp(imageA)
    .composite([{
      input: imageB,
      top: positions.y,
      left: positions.x
    }])
    .toFile(destination)
    .then(() => true)
    .catch(error => {
      log.error(error, 'Error to processing images')
      return false
    })
}

/**
 * Make the thumbnail image
 * @param { string } origin - The base image
 * @param { string } destination - The path to save the thumbnail
 * @param { number } width - The width of image
 * @param { number } height - The height of image
 * @param { number } quality - The quality of image
 * @return { Promise<Boolean> }
 */
async function makeThumbnail (origin, destination, width = 300, height = 300, quality = 70) {
  return sharp(origin)
    .resize(width, height)
    .toFile(destination)
    .then(() => true)
    .catch(error => {
      log.error(error, `Error: could not process thumnail: ${origin}`)
      return false
    })
}

module.exports = {
  joinImges,
  makeThumbnail
}
