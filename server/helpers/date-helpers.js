/**
 * Module date-helpers.js
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const moment = require('moment')

const yyyymmdd2date = (yyyymmdd) => {
  const re  = /(\d\d\d\d)(\d\d)(\d\d)/i
  const res = yyyymmdd.toString().match(re)
  if (!res) {
    throw new Error('Invalid date ' + yyyymmdd)
  }

  const y = res[1]
  const m = res[2]
  const d = res[3]

  return new Date(y + '-' + m + '-' + d)
}

const date2yyyymmdd = (date) => {
  const mDate = moment(date)
  if (!mDate.isValid()) throw new Error('Invalid date ' + date)

  const y = mDate.format('YYYY').toString()
  const m = mDate.format('MM').toString()
  const d = mDate.format('DD').toString()

  return y + '' + m + '' + d
}

module.exports.yyyymmdd2date = yyyymmdd2date
module.exports.date2yyyymmdd = date2yyyymmdd