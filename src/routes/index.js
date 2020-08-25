const processo = require('./processor')

/**
 * Register the routes
 * @param { Express } app
 * @return { Express }
 */
exports.router = (app) => {
  processo.router(app)

  return app
}
