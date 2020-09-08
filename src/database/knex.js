const knexfile = require('../knexFile')
const knex = require('knex')(knexfile.development)

module.exports = knex
