const log = require('bole')('application-status/database-sattus')
const knex = require('../database/knex')

/**
 * Check if the database is up
 * @return { Promise<Boolean> }
 */
async function checkDatabaseConnection () {
  return knex
    .raw('SELECT 1+1')
    .then(() => {
      log.info('databse is up')
      return true
    })
    .catch(error => {
      log.error(error.message, 'database is down')
      return false
    })
}

module.exports = {
  checkDatabaseConnection
}
