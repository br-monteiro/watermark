const Ajv = require('ajv')
const { SchemaValidator } = require('./SchemaValidator')

exports.validator = new SchemaValidator(new Ajv({ allErrors: true }))
