/**
 * Always provide an array. If the 'value' is an array, return it.
 * Otherwaise returs an empty array
 * @param { * } value - The value to be checked
 * @return { Array }
 */
function safeArray (value) {
  return Array.isArray(value) ? value : []
}

module.exports = {
  safeArray
}
