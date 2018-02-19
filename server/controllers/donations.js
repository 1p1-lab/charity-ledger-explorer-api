/**
 * Module donations.js
 *
 * Foundation donation controller
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

module.exports = (request, response) => {

  const app = request.app

  /**
   * Get donations
   *
   * @returns {Promise}
   *
   * @author  Marunin Alexey <amarunin@oneplus1.ru>
   * @since   0.1.0
   */
  async function getDonations () {
    const action = require('./actions/get-donations')
    return action(app, request, response)
  }

  return {
    getDonations,
  }
}
