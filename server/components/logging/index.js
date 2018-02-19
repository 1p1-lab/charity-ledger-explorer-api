/**
 * Module index.js
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const _       = require('lodash')
const winston = require('winston')
const fs      = require('fs')
const path    = require('path')
const util    = require('util')
const appRoot = require('app-root-path').path

const LOGS_DIR = path.join(appRoot, process.env.LOGS_DIR)

const format  = winston.format
const Console = winston.transports.Console
const File    = winston.transports.File

const consoleTransport = (level) => {
  const json     = false
  const colorize = true
  return new Console({level, colorize, json})
}

const fileTransport = (file, level) => {
  const filename = path.join(LOGS_DIR, file)
  const json     = false
  const maxsize  = 52428800
  return new File({filename, level, json, maxsize})
}

const loggingFormat = format.printf((info, options) => {
  const timestamp = (new Date()).toLocaleTimeString()
  const label     = info.label
  const level     = info.level
  const message   = util.format.apply(this, [info.message].concat(info.splat || []))
  return util.format('%s [%s] %s: %s', timestamp, label, level, message)
})

const loggingFormats = (label) => {
  return format.combine(format.label({label}), loggingFormat)
}

const createDefaultLogger = () => {
  return winston.createLogger({
    format: loggingFormats('App'),

    transports: [
      consoleTransport('info'),
      fileTransport('app.log', 'info'),
    ],

    exitOnError: false
  })
}

const createDatabaseLogger = () => {
  return winston.createLogger({
    format: loggingFormats('Database'),

    transports: [
      consoleTransport('info'),
      fileTransport('database.log', 'info'),
    ],

    exitOnError: false
  })
}

const createParserLogger = () => {
  return winston.createLogger({
    format: loggingFormats('Parse'),

    transports: [
      consoleTransport('info'),
      fileTransport('parse.log', 'info'),
    ],

    exitOnError: false
  })
}

const createBlockchainLogger = () => {
  return winston.createLogger({
    format: loggingFormats('Blockchain'),

    transports: [
      consoleTransport('info'),
      fileTransport('blockchain-trace.log', 'info'),
      fileTransport('blockchain-errors.log', 'error')
    ],

    exitOnError: false
  })
}

module.exports = (app, options) => {

  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR)
  }

  app['loggers'] = {}

  app.loggers['default']    = createDefaultLogger()
  app.loggers['app']        = app.loggers.default
  app.loggers['database']   = createDatabaseLogger()
  app.loggers['blockchain'] = createBlockchainLogger()
  app.loggers['parser']     = createParserLogger()

  app['getLogger'] = (name) => {
    if (_.isUndefined(name)) return app.getLogger('default')
    if (_.toLower(name) === 'console') return console
    return _.get(app, 'loggers.' + _.toLower(name), console)
  }
}