const router = require('express').Router()
const { checkDatabaseConnection } = require('./databases-status')

router.get('/status', async (_, res) => {
  res.send({
    message: "we're working",
    database: await checkDatabaseConnection()
  })
})

module.exports = router
