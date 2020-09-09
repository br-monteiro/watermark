const assert = require('assert')
const { fileExists, basename } = require('./')

describe('file-manage', () => {
  it('fileExists', () => {
    assert.equal(fileExists('.gitkeep'), true)
    assert.equal(fileExists('testeteteste.jpg'), false)
    assert.equal(fileExists(''), false)
    assert.equal(fileExists(), false)
  })

  it('basename', () => {
    assert.equal(basename('test.jpg'), 'test.jpg')
    assert.equal(basename('teste/test.jpg'), 'test.jpg')
    assert.equal(basename('test'), 'test')
    assert.equal(basename(''), undefined)
    assert.equal(basename(), undefined)
  })
})
