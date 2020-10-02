const config = require('../config')
const env = config.env.PRD ? 'production' : 'development'

console.log('environment db', env)
console.log(config.knex)

const knex = require('knex')(config.knex[env])

module.exports = knex
