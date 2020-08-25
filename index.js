const express = require('express')
const { setConfigs } = require('./src/server/configurations')
const { router } = require('./src/routes')

const PORT = 3000
const app = setConfigs(express())

router(app)
  .listen(PORT, () => {
    console.log(`## Runing on http://localhost:${PORT}/`)
  })
