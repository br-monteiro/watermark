const log = require('bole')('processor/router')
const router = require('express').Router()

const { initQueue } = require('./processor')
const { validator } = require('../validator')
const requestSchema = require('../schemes/request.json')

router.post('/processor', (req, res) => {
  if (!validator.validate(req.body, requestSchema)) {
    const errors = validator.getErrors()

    log.error(errors, 'error with request')
    res.status(400).send(errors)

    return
  }

  res.send(initQueue(req.body))
})

module.exports = router
