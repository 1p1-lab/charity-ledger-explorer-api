/**
 * Module pull-cost-items-from-blockchain.js
 *
 * Action to load foundation cost items from blockchain to local storage
 *
 * Request params:
 *    idFoundation {integer}
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

module.exports = async (app, request, params) => {
  const idFoundation = request.idFoundation

  if (!idFoundation) {
    throw new Error('No foundation specified')
  }

  await app.services.costs.pullCostItemsFromBlockchain(idFoundation, params)
}
