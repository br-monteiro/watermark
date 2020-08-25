const assert = require('assert')
const utils = require('../src/utils')

describe('Utils functions', () => {
  it('safeArray', () => {
    assert.deepEqual(utils.safeArray(), [])
    assert.deepEqual(utils.safeArray(false), [])
    assert.deepEqual(utils.safeArray(true), [])
    assert.deepEqual(utils.safeArray(''), [])
    assert.deepEqual(utils.safeArray(undefined), [])
    assert.deepEqual(utils.safeArray(null), [])
    assert.deepEqual(utils.safeArray(Array), [])
    assert.deepEqual(utils.safeArray({}), [])
    assert.deepEqual(utils.safeArray([1, 2, 3]), [1, 2, 3])
    assert.deepEqual(utils.safeArray([{ id: true }, { id: false }]), [{ id: true }, { id: false }])
  })
})
