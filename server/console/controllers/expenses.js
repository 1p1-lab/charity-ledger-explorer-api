/**
 * Module expenses.js
 * Donations console controller
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

module.exports = (request) => {

  const app = request.app

  async function updateExpensesFromBlockchain () {
    const action = require('./actions/pull-expenses-from-blockchain')
    return action(app, request)
  }

  async function importExpensesToBlockchain () {
    const action = require('./actions/push-expenses-to-blockchain')
    return action(app, request)
  }

  return {
    updateExpensesFromBlockchain,
    importExpensesToBlockchain,
  }
}