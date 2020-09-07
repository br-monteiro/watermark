const assert = require('assert')
const { validator } = require('../validator')
const schema = require('./request.json')

describe('JSON Schemes - request', () => {
  let data

  beforeEach(() => {
    data = [
      {
        justTest: true
      },
      {
        justTest: true
      }
    ]
  })

  it('validate the "request.json" schema', () => {
    assert.equal(true, validator.validate(data, schema))
  })
})
