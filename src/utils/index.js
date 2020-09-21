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

module.exports = {
  safeArray,
  getUrlDetails
}
