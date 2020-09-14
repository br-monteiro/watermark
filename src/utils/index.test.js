const assert = require('assert')
const utils = require('./index')

describe('Utils functions', () => {
  it('safeArray', () => {
    assert.deepStrictEqual(utils.safeArray(), [])
    assert.deepStrictEqual(utils.safeArray(false), [])
    assert.deepStrictEqual(utils.safeArray(true), [])
    assert.deepStrictEqual(utils.safeArray(''), [])
    assert.deepStrictEqual(utils.safeArray(undefined), [])
    assert.deepStrictEqual(utils.safeArray(null), [])
    assert.deepStrictEqual(utils.safeArray(Array), [])
    assert.deepStrictEqual(utils.safeArray({}), [])
    assert.deepStrictEqual(utils.safeArray([1, 2, 3]), [1, 2, 3])
    assert.deepStrictEqual(utils.safeArray([{ id: true }, { id: false }]), [{ id: true }, { id: false }])
  })
})
