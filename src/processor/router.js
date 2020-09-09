const log = require('bole')('processor/router')
const router = require('express').Router()

const { initQueue } = require('./processor')
const { validator } = require('../validator')
const requestSchema = require('../schemes/request.json')

router.post('/processor', async (req, res) => {
  if (!validator.validate(req.body, requestSchema)) {
    const errors = validator.getErrors()

    log.error(errors, 'error with request')
    res.status(400).send(errors)

    return
  }

  const response = await initQueue(req.body)
  res.send(response)
})

module.exports = router
