const assert = require('assert')
const { fileExists, basename } = require('./')

describe('file-manage', () => {
  it('fileExists', () => {
    assert.strictEqual(fileExists('.gitkeep'), true)
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
})
