const app = require('express')()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/api/v1', require('./processor/router'))

app.use('/api/v1', require('./application-status/router'))

module.exports = app
