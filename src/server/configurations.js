const bodyParser = require('body-parser')

exports.setConfigs = (app) => {
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyParser.json())

  return app
}
