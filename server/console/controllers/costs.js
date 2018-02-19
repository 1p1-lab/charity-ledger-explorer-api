/**
 * Module costs.js
 * Foundation cost items console controller
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

module.exports = (request) => {

  const app = request.app

  async function updateCostItemsFromBlockchain () {
    const action = require('./actions/pull-cost-items-from-blockchain')
    return action(app, request)
  }

  async function importCostItemsToBlockchain () {
    const action = require('./actions/push-cost-items-to-blockchain')
    return action(app, request)
  }

  return {
    updateCostItemsFromBlockchain,
    importCostItemsToBlockchain,
  }
}