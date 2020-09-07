const app = require('express')()
const bodyParser = require('body-parser')
// const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/api/v1', require('./processor/router'))

module.exports = app
