/**
 * Module index.js
 *
 * Initialize component
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const Sequelize = require('sequelize')
const databases = require('./config/config')

module.exports = (app, options) => {
  const env            = process.env.NODE_ENV || 'development'
  const databaseConfig = databases[env]

  // Set custom logging mechanism
  const logger = app.loggers.database
  databaseConfig['logging'] = function (text, obj) {
    return logger.info(text)
  }

  const sequelize = new Sequelize(databaseConfig)

  sequelize['getModel'] = (modelName) => {
    return sequelize.models[modelName]
  }

  return sequelize
    .authenticate()
    .then(() => {

      app['sequelize'] = sequelize
      return sequelize.databaseVersion()
        .then((version) => {
          logger.info('Database version: %s %s', databaseConfig.dialect, version)
          require('./setup-models')(sequelize, options)
          app.emit('sequelize.init', sequelize)
          return sequelize
        })
    })
    .catch(err => {
      logger.error('Unable to connect to the database: %s', err.message)
    })
}
