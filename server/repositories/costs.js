/**
 * Module costs.js
 * Foundation costs repository
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const _ = require('lodash')

module.exports = (sequelize) => {
  const Model = sequelize.getModel('CostItem')

  const populateModel = (model) => {
    if (!model) return {}
    return {
      idCostItem:   model.idCostItem,
      idFoundation: model.idFoundation,
      name:         model.name,
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

  async function findAndCountAll (query) {
    const result = await Model.findAndCountAll(query)
    const count  = result.count
    const items  = populateModels(result.rows)
    return {count, items}
  }

  async function findOne (query) {
    const model = await Model.findOne(query)
    return populateModel(model)
  }

  async function findById (idFoundation, idCostItem) {
    const query = {
      where:   {
        idFoundation,
        idCostItem,
      },
      include: [
        {model: sequelize.getModel('Foundation'), as: 'foundation'},
      ]
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

  async function findByFoundation (idFoundation) {
    const query = {
      where: {
        idFoundation
      },
    }
    const model = await findOne(query)
    return _.isEmpty(model) ? null : model
  }

  async function count (query) {
    const count = await Model.count(query)
    return (!_.isNaN(count) && _.isNumber(count) ? parseInt(count) : 0)
  }

  async function sum (query) {
    const count = await Model.count(query)
    return (!_.isNaN(count) && _.isNumber(count) ? parseFloat(count) : 0)
  }

  return {
    findById,
    findByName,
    findByFoundation,
    findAll,
    findAndCountAll,
    findOne,
    count,
    sum,
  }
}
