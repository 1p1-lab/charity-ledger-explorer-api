/**
 * Module pull-donators-from-blockchain.js
 *
 * Action to load donators from blockchain to local storage
 *
 * Request params:
 *    idFoundation {integer}
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

module.exports = async (app, request, params) => {
  await app.services.donators.pullDonatorsFromBlockchain(params)
}
