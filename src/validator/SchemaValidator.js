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
          message: error.message,
          path: error.dataPath
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
    const validate = this._engine.compile(schema)
    const isValid = validate(input)

    this._errors = !isValid ? validate.errors : []

    return isValid
  }
}

exports.SchemaValidator = SchemaValidator
