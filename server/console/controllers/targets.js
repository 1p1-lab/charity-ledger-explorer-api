/**
 * Module targets.js
 * Foundation targets console controller
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

module.exports = (request) => {

  const app = request.app

  async function updateTargetsFromBlockchain () {
    const action = require('./actions/pull-targets-from-blockchain')
    return action(app, request)
  }

  async function importTargetsToBlockchain () {
    const action = require('./actions/push-targets-to-blockchain')
    return action(app, request)
  }

  return {
    updateTargetsFromBlockchain,
    importTargetsToBlockchain,
  }
}