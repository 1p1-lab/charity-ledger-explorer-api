/**
 * Module pull-expenses-from-blockchain.js
 *
 * Action to load expenses from blockchain to local storage
 *
 * Request params:
 *    idFoundation {integer}
 *    minDate {string} YYYY-MM-DD
 *    maxDate {string} YYYY-MM-DD
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const moment    = require('moment')
const validator = require('../../../helpers/validators')

module.exports = async (app, request, params) => {
  const idFoundation = request.idFoundation
  const minDate      = request.minDate || moment().format('YYYY-MM-DD')
  const maxDate      = request.maxDate || moment().format('YYYY-MM-DD')

  if (!idFoundation) {
    throw new Error('No foundation specified')
  }
  if (!validator.isDate(minDate)) {
    throw new Error('Min date - incorrect date format')
  }
  if (!validator.isDate(maxDate)) {
    throw new Error('Max date - incorrect date format')
  }

  for (const it = moment(minDate); !it.isAfter(maxDate); it.add(1, 'days')) {
    const dDoc = it.format('YYYY-MM-DD')
    await app.services.expenses.pullExpensesFromBlockchain(idFoundation, dDoc, params)
  }
}
