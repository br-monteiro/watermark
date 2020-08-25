const { validator } = require('../validator')
const requestSchema = require('../validator/schemes/request.json')
const { initQueue } = require('../utils')
/**
 * Register the routes
 * @param { Express } app
 * @return { Express }
 */
exports.router = (app) => {
  app.post('/v1/processor', (req, res) => {
    if (!validator.validate(req.body, requestSchema)) {
      res.status(400).send(validator.getErrors())
      return
    }

    res.send(initQueue(req.body))
  })

  return app
}
