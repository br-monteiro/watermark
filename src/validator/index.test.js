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
    assert.strictEqual('function', typeof validator.validate)
    assert.strictEqual(false, validator.validate('jewjdjw djwd', schema))
    assert.strictEqual(true, validator.validate(7, schema))
  })

  it('getErrors', () => {
    validator.validate('jewjdjw djwd', schema)

    const errors = validator.getErrors()
    const expected = [{
      message: 'should be integer',
      path: ''
    }]

    assert.strictEqual('function', typeof validator.getErrors)
    assert.strictEqual(true, Array.isArray(errors))
    assert.deepStrictEqual(errors, expected)

    validator.validate(7, schema)
    assert.deepStrictEqual([], validator.getErrors())
  })
})
