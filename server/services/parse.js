/**
 * Module parse.js
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   1.0
 */

const _       = require('lodash')
const parse   = require('csv-parse')
const fs      = require('../helpers/fs-helpers')

async function parseCsvFile (filePath, options) {

  const parseOptions = _.extend({
    delimiter:       ',',
    auto_parse:      false,
    auto_parse_date: false,
    columns:         true,
    quote:           '"',
    comment:         '#'
  }, options.parseOptions)

  // const columns = _.extend({}, options.columns)
  const logger = options.logger||console

  const defaultValidator = (item, line) => true
  const validate = options.validate||defaultValidator

  const defaultTransform = (item, line) => item
  const transform = options.transform||defaultTransform

  logger.info('File: %s', filePath)
  const result = await fs.readFile(filePath)
  if (!result.success) {
    const error = result.error
    logger.error('Error while opening! %s', error)
    throw new Error(error)
  }

  const items = []
  const validateErrors = []

  return new Promise((resolve) => {
    let line = 0
    logger.info('Parsing file...')
    const parser = parse(parseOptions)
    parser.on('readable', () => {
      let item = parser.read()
      if (item) {
        line++
        logger.info('%j', item)
        try {
          if (_.isFunction(validate)) {
            const error = validate(item, line)
            if (error !== true) {
              logger.warn('Validation error! Line %d, %s', line, error)
              validateErrors.push({line,error})
            }
          }
          if (_.isFunction(transform)) {
            item = transform(item, line)
          }
        }
        catch (exception) {
          const error = exception.message
          logger.error('%s', error)
          const parsed = false
          resolve({parsed, error})
        }
        items.push(item)
      }
    })
    parser.on('error', error => {
      logger.error('%s', error)
      const parsed = false
      resolve({parsed, error})
    })
    parser.on('finish', function () {
      logger.info('Parsed lines: %d', items.length)
      logger.info('Validation errors: %d', validateErrors.length)
      const validated = (validateErrors.length === 0)
      const parsed = true
      resolve({parsed, items, validated, validateErrors})
    })

    parser.write(result.data)
    parser.end()
  })

}

module.exports = (app) => {

  const logger = app.loggers.parser

  async function parse (filePath, options) {
    const format = fs.extname(filePath).toUpperCase()
    switch (format) {
    case '':
    case 'CSV':
      return await parseCsvFile(filePath, _.extend({logger}, options))
      break
    }
    throw new Error('Unsupported file format: ' + format)
  }

  return {
    parse
  }
}