const { Validator } = require('jsonschema')
const { SchemaValidator } = require('./SchemaValidator')

exports.validator = new SchemaValidator(new Validator())
