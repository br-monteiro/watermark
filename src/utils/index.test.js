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

  it('getUrlDetails', () => {
    assert.deepStrictEqual(utils.getUrlDetails(), undefined)
    assert.deepStrictEqual(utils.getUrlDetails(''), undefined)
    assert.deepStrictEqual(utils.getUrlDetails(false), undefined)
    assert.deepStrictEqual(utils.getUrlDetails('http://test.com'), {
      hostname: 'test.com',
      protocol: 'http:',
      port: 80,
      pathname: '/',
      search: ''
    })
    assert.deepStrictEqual(utils.getUrlDetails('https://test.com:8000/test-route?test=true'), {
      hostname: 'test.com',
      protocol: 'https:',
      port: 8000,
      pathname: '/test-route',
      search: '?test=true'
    })
  })
})
