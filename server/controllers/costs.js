/**
 * Module costs.js
 * Foundation cost item controller
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

module.exports = (request, response) => {
  const app = request.app

  /**
   * Returns cost items
   *
   * @returns {Promise}
   *
   * @author  Marunin Alexey <amarunin@oneplus1.ru>
   * @since   0.1.0
   */
  async function getAllCostItems () {
    const params   = request.query || {}
    const programs = await app.services.costs.getAllCostItems(params)
    response.json(programs)
  }

  /**
   * Returns details about specified cost item
   *
   * @returns {Promise}
   *
   * @author  Marunin Alexey <amarunin@oneplus1.ru>
   * @since   0.1.0
   */
  async function getCostItemDetails () {
    const idFoundation   = request.params.idFoundation
    const idCostItem      = request.params.idCostItem
    const costItemDetails = await app.services.costs.getCostItemDetails(idFoundation, idCostItem)
    costItemDetails ? response.json(costItemDetails) : response.sendStatus(404)
  }

  return {
    getAllCostItems,
    getCostItemDetails,
  }
}
