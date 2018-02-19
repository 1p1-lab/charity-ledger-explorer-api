/**
 * Module donations.js
 * Donations console controller
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

module.exports = (request) => {

  const app = request.app

  async function updateDonationsFromBlockchain () {
    const action = require('./actions/pull-donations-from-blockchain')
    return action(app, request)
  }

  async function importDonationsToBlockchain () {
    const action = require('./actions/push-donations-to-blockchain')
    return action(app, request)
  }

  return {
    updateDonationsFromBlockchain,
    importDonationsToBlockchain,
  }
}