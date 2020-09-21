const config = require('../config')
const env = config.env.PRD ? 'production' : 'development'

const knex = require('knex')(config.knex[env])

module.exports = knex
