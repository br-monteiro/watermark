const assert = require('assert')
const { validator } = require('./index')

describe('ValidatorSchema', () => {
  let schema = {}

  beforeEach(() => {
    schema = {
      type: 'integer',
      minimum: 3
    }
  })

  it('validate', () => {
    assert.equal('function', typeof validator.validate)
    assert.equal(false, validator.validate('jewjdjw djwd', schema))
    assert.equal(true, validator.validate(7, schema))
  })

  it('getErrors', () => {
    validator.validate('jewjdjw djwd', schema)

    const errors = validator.getErrors()
    const expected = [{
      message: 'instance is not of a type(s) integer',
      input: 'jewjdjw djwd'
    }]

    assert.equal('function', typeof validator.getErrors)
    assert.equal(true, Array.isArray(errors))
    assert.deepEqual(errors, expected)

    validator.validate(7, schema)
    assert.deepEqual([], validator.getErrors())
  })
})
