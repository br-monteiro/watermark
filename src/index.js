const app = require('express')()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/api/v1', require('./processor/router'))

app.get('/api/v1/status', (_, res) => res.send("we're working"))

module.exports = app
