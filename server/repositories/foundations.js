/**
 * Module foundations.js
 * Foundation repository
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 *
 */

const _ = require('lodash')

module.exports = (sequelize) => {

  const Model = sequelize.getModel('Foundation')

  const populateModel = (model) => {
    if (!model) return {}

    return {
      idFoundation:  model.idFoundation,
      name:          model.name,
      address:       model.address,
      idMarketplace: model.idMarketplace,
      website:       model.website,
    }
  }

  const populateModels = (models) => {
    return _.map(models, model => {
      return populateModel(model)
    })
  }

  async function findAll (query) {
    const models = await Model.findAll(query)
    return populateModels(models)
  }

  async function findOne (query) {
    const model = await Model.findOne(query)
    return populateModel(model)
  }

  async function findById (idFoundation) {
    const query = {
      where: {
        idFoundation
      },
    }
    const model = await findOne(query)
    return _.isEmpty(model) ? null : model
  }

  async function findByName (name) {
    const query = {
      where: {
        name: {like: '%' + name + '%'}
      },
    }
    const model = await findOne(query)
    return _.isEmpty(model) ? null : model
  }

  async function findByAddress (address) {
    const query = {
      where: {
        address
      },
    }
    const model = await findOne(query)
    return _.isEmpty(model) ? null : model
  }

  return {
    findById,
    findByName,
    findByAddress,
    findAll,
    findOne,
  }
}
