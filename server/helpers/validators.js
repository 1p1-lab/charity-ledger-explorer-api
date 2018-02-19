/**
 * Module validators.js
 * Simple validators
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

// See https://github.com/chriso/validator.js/
const validator = require('validator')
const moment = require('moment')
const _ = require('lodash')

module.exports.isEmpty = (value) => {
  return _.isNull(value) || _.isUndefined(value) || validator.isEmpty(value)
}

module.exports.isId = (value) => {
  return validator.isNumeric(value)
}

module.exports.isAddress = (value) => {
  return validator.isHexadecimal(value)
}

module.exports.isExceedLength = (str, length) => {
  return !validator.isLength(str, {max:length})
}

module.exports.isLength = (value, min, max) => {
  return validator.isLength(value, {min, max})
}

module.exports.isEmail = (value) => {
  return validator.isEmail(value)
}

module.exports.isFloat = (value) => {
  return validator.isFloat(value)
}

module.exports.isDate = (value) => {
  const date = new Date(value)
  return _.isDate(date) && moment(date).isValid()
}
