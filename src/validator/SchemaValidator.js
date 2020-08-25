/**
 * @typedef InputSchemaError
 * @property { String } message
 * @property { String | Number | Object } input
 */

class SchemaValidator {
  constructor (engine) {
    this._engine = engine
    this._errors = []
  }

  /**
   * Returns the all errors
   * @return { Array<InputSchemaError> }
   */
  getErrors () {
    return this._errors
      .map(error => {
        return {
          message: error.stack,
          input: error.instance
        }
      })
  }

  /**
   * Validate the input values according the JSON Schema
   * @param { Object } input - The value to be validated
   * @param { Object } schema - The JSON Schema
   * @return { Boolean }
   */
  validate (input, schema) {
    this._errors = this._engine.validate(input, schema).errors
    return this._errors.length === 0
  }
}

exports.SchemaValidator = SchemaValidator
