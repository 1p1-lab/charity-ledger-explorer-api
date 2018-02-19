/**
 * Module services.js
 * Initialize app services
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const _       = require('lodash')
const appRoot = require('app-root-path').path
const path    = require('path')
const fs      = require('fs')

const SERVICE_PATH = path.join(appRoot, 'server', 'services')

module.exports = (app) => {

  app.on('sequelize.init', (sequelize) => {

    app['services'] = {}

    // Available services
    const serviceNames = [
      'foundations',
      'projects',
      'programs',
      'targets',
      'costs',
      'donators',
      'donations',
      'expenses',
      'parse',
    ]

    // Define services
    _.each(serviceNames, serviceName => {
      const servicePath = path.join(SERVICE_PATH, serviceName + '.js')
      if (fs.existsSync(servicePath)) {
        const service = require(servicePath)
        app.services[serviceName] = service(app)
      }
    })

    app.emit('services.init', app.services)
  })
}
