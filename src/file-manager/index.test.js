const assert = require('assert')
const { fileExists, basename, pathname } = require('./')
const { staticPaths } = require('../config')

describe('file-manage', () => {
  it('fileExists', () => {
    assert.strictEqual(fileExists(`${staticPaths.input}.gitkeep`), true)
    assert.strictEqual(fileExists('testeteteste.jpg'), false)
    assert.strictEqual(fileExists(''), false)
    assert.strictEqual(fileExists(), false)
  })

  it('basename', () => {
    assert.strictEqual(basename('test.jpg'), 'test.jpg')
    assert.strictEqual(basename('teste/test.jpg'), 'test.jpg')
    assert.strictEqual(basename('test'), 'test')
    assert.strictEqual(basename(''), undefined)
    assert.strictEqual(basename(), undefined)
  })

  it('pathname', () => {
    assert.strictEqual(pathname('images/teste/test.jpg'), 'images/teste/')
    assert.strictEqual(pathname('images/teste/'), 'images/teste/')
    assert.strictEqual(pathname('images/teste'), 'images/')
    assert.strictEqual(pathname('images/'), 'images/')
    assert.strictEqual(pathname(''), undefined)
    assert.strictEqual(pathname(), undefined)
    assert.strictEqual(pathname(false), undefined)
    assert.strictEqual(pathname([]), undefined)
  })
})
