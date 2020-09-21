const gm = require('gm').subClass({ imageMagick: true })
const log = require('bole')('image-processor')

/**
 * Join two images according positions
 * @param { string } imageA - The image name
 * @param { string } imageB - The image name
 * @param { string } destination - The image generated destination
 * @param { ImagePositions } positions - The positions to join the image 'B'
 * @return { Promise<Boolean> }
 */
function joinImges (imageA, imageB, destination, positions) {
  return new Promise(resolve => {
    if (
      !imageA ||
      !imageB ||
      !destination ||
      !positions
    ) {
      log.error('error with parameters')
      resolve(false)
      return
    }

    gm(imageA)
      .draw([`image over ${positions.x},${positions.y}  ${positions.width},${positions.height} "${imageB}"`])
      .write(destination, async error => {
        if (error) {
          log.error(error, 'error to processing image')
          resolve(false)
          return
        }
        resolve(true)
      })
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
  try {
    gm(origin)
      .thumb(width, height, destination, quality, (error) => {
        if (error) {
          log.error(error, `Error: could not process thumnail: ${origin}`)
          Promise.resolve(false)
        }
        Promise.resolve(true)
      })
  } catch (_) {
    log.error(`Error: could not process thumnail: ${origin}`)
    return false
  }
}

module.exports = {
  joinImges,
  makeThumbnail
}
