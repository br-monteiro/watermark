const log = require('bole')('processor/router')
const router = require('express').Router()

const { initQueue, initProcessor } = require('./processor')
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

router.post('/force-processor', async (req, res) => {
  const queueId = req.query.queueId
  const queueStatus = req.query.queueStatus || 'queued'
  const queueItemsStatus = req.query.queueItemsStatus || 'queued'

  initProcessor(true, queueStatus, queueItemsStatus)

  res.send({ queueStatus, queueItemsStatus, queueId })
})

module.exports = router
