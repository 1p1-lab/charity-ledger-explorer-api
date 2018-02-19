/**
 * Module foundations.js
 * Foundation controller
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const _ = require('lodash')

module.exports = (request, response) => {

  const app        = request.app
  const sequelize  = app.sequelize
  const Foundation = sequelize.getModel('Foundation')
  const Program    = sequelize.getModel('Program')
  const api        = app.blockchain.foundations

  const populate = (data) => {
    const idFoundation = parseInt(data[1].toString(10))
    const name         = data[2]
    const address      = data[3]
    return {idFoundation, name, address}
  }

  // Получение всех фондов
  async function getAll () {
    const params      = request.query || {}
    const foundations = await Foundation.buildQuery(params).all()
    response.json(foundations)
  }

  // Получение конкретного фонда
  async function getByID () {
    const idFoundation      = request.params.idFoundation
    const params            = request.query || {}
    const foundationDetails = await app.services.foundations.getFoundationDetails(idFoundation, params)
    foundationDetails ? response.json(foundationDetails) : response.sendStatus(404)
  }

  // Получение списка программ фонда
  async function getPrograms () {
    const idFoundation = request.params.idFoundation
    const programs     = await Program.buildQuery({idFoundation}).all()
    response.json(programs)
  }

  return {
    getAll,
    getByID,
    getPrograms,
  }
}
