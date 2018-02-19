/**
 * Module donators.js
 * Donators console controller
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

module.exports = (request) => {

  const app = request.app

  async function updateDonatorsFromBlockchain () {
    const action = require('./actions/pull-donators-from-blockchain')
    return action(app, request)
  }

  async function importDonatorsToBlockchain () {
    const action = require('./actions/push-donators-to-blockchain')
    return action(app, request)
  }

  return {
    updateDonatorsFromBlockchain,
    importDonatorsToBlockchain,
  }
}