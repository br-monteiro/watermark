#!/usr/bin/env node
const app = require('./index')
const config = require('./config')
const bole = require('bole')

bole.output({ level: 'debug', stream: process.stdout })
const log = bole('server')

log.info('server process starting')

app.listen(config.express.port, function (error) {
  if (error) {
    log.error('unable to listen for connections', error)
    process.exit(10)
  }

  log.info(`express is listening on port ${config.express.port}`)
})
