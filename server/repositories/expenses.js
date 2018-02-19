/**
 * Module expenses.js
 * Foundation expenses repository
 *
 * @author  Alex G. <alexg@oneplus1.ru>
 * @since   0.1.0
 */

const _ = require('lodash')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = (sequelize) => {
  const Model = sequelize.getModel('ExpenseView')

  const populateModel = (model) => {
    if (!model) return {}
    return {
      idExpense:      model.idExpense,
      sum:            model.sum,
      idCostItem:     model.idCostItem,
      costItemName:   model.costItemName,
      isPerson:       model.isPerson,
      idFoundation:   model.idFoundation,
      nameFoundation: model.nameFoundation,
      idProject:      model.idProject,
      nameProject:    model.nameProject,
      idProgram:      model.idProgram,
      nameProgram:    model.nameProgram,
      nDoc:           model.nDoc,
      dDoc:           model.dDoc,
      remark:         model.remark,
      txId:           model.txId,
    }
  }

  const populateModelByProject = (model) => {
    if (!model) return {}
    return {
      id:      model.idProject,
      amount:  model.sum,
      name:    model.nameProject,
    }
  }

  const populateModelByProgram = (model) => {
    if (!model) return {}
    return {
      id:      model.idProgram,
      amount:  model.sum,
      name:    model.nameProgram,
    }
  }

  const populateModels = (models) => {
    return _.map(models, model => {
      return populateModel(model)
    })
  }

  const getDatePeriod = (params, dateFromName, dateToName) => {
    if (_.has(params, dateFromName) && _.get(params, dateFromName) && _.has(params, dateToName) && _.get(params, dateToName)) {
        return {[Op.gte]: _.get(params, dateFromName), [Op.lte]: _.get(params, dateToName)}
    } else {
      if (_.has(params, dateFromName) && _.get(params, dateFromName)) {
        return {[Op.gte]: _.get(params, dateFromName)}
      }

      if (_.has(params, dateToName) && _.get(params, dateToName)) {
        return {[Op.lte]: _.get(params, dateToName)}
      }

      return {}
    }
  }

  async function findAll (query) {
    const donations = await Model.findAll(query)
    return populateModels(donations)
  }

  async function findOne (query) {
    const donation = await Model.findOne(query)
    return populateModel(donation)
  }

  const populateModelsByProject  = (models) => {
    return _.map(models, model => {
      return populateModelByProject(model)
    })
  }

  const populateModelsByProgram  = (models) => {
    return _.map(models, model => {
      return populateModelByProgram(model)
    })
  }

  async function sum (query) {
    const sum = await Model.sum('sum', query)
    return (!_.isNaN(sum) && _.isNumber(sum) ? parseFloat(sum) : 0)
  }

  async function getSumByFoundation (idFoundation, params) {
    const query = {where: {idFoundation}}
    _.set(query, 'where.dDoc', getDatePeriod(params, 'dateFrom', 'dateTo'))
    return await sum(query)
  }

  async function findByProject (idFoundation, idProject, params) {
    const query = {where: {idFoundation, idProject}, order: [['dDoc','DESC']]}
    _.set(query, 'where.dDoc', getDatePeriod(params, 'dateFrom', 'dateTo'))
    return await findAll(query)
  }

  async function getSumByProject (idFoundation, idProject, params) {
    const query = {where: {idFoundation, idProject}}
    _.set(query, 'where.dDoc', getDatePeriod(params, 'dateFrom', 'dateTo'))
    return await sum(query)
  }

  async function findByProgram (idFoundation, idProgram, params) {
    const query = {where: {idFoundation, idProgram}, order: [['dDoc','DESC']]}
    _.set(query, 'where.dDoc', getDatePeriod(params, 'dateFrom', 'dateTo'))
    return await findAll(query)
  }

  async function getSumByProgram (idFoundation, idProgram, params) {
    const query = {where: {idFoundation, idProgram}}
    _.set(query, 'where.dDoc', getDatePeriod(params, 'dateFrom', 'dateTo'))
    return await sum(query)
  }

  async function findByProjectOrProgram (idFoundation, idProject, idProgram, params) {
    if (!idProject && !idProgram)
      return null

    const query = {where: {idFoundation}, order: [['dDoc','DESC']]}
    _.set(query, 'where.dDoc', getDatePeriod(params, 'dateFrom', 'dateTo'))

    if (idProject && idProgram) {
      _.set(query.where, [Op.or], {idProject: {[Op.eq]: idProject}, idProgram: {[Op.eq]: idProgram}})
    } else {
      if (idProject)
        _.set(query, 'where.idProject', {[Op.eq]: idProject})

      if (idProgram)
        _.set(query, 'where.idProgram', {[Op.eq]: idProgram})
    }

    return await findAll(query)
  }

  async function getSumByProjectOrProgram (idFoundation, idProject, idProgram, params) {
    if (!idProject && !idProgram)
      return null

    const query = {where: {idFoundation}}
    _.set(query, 'where.dDoc', getDatePeriod(params, 'dateFrom', 'dateTo'))

    if (idProject && idProgram) {
      _.set(query.where, [Op.or], {idProject: {[Op.eq]: idProject}, idProgram: {[Op.eq]: idProgram}})
    } else {
      if (idProject)
        _.set(query, 'where.idProject', {[Op.eq]: idProject})

      if (idProgram)
        _.set(query, 'where.idProgram', {[Op.eq]: idProgram})
    }

    return await sum(query)
  }

  async function getFoundationExpensesByProject (idFoundation, params) {

    const query = {
      where: {
        idFoundation,
        idProject: {[Op.ne]: null, [Op.ne]: 0}
      },
      group: 'idProject',
      attributes: [[sequelize.fn('sum', sequelize.col('sum')), 'sum'], 'nameProject', 'idProject']
    }

    _.set(query, 'where.dDoc', getDatePeriod(params, 'dateFrom', 'dateTo'))

    const data = await Model.findAll(query)

    return populateModelsByProject(data)
  }

  async function getFoundationExpensesByPrograms (idFoundation, params) {

    const query = {
      where: {
        idFoundation,
        idProgram: {[Op.ne]: null, [Op.ne]: 0}
      },
      group: 'idProgram',
      attributes: [[sequelize.fn('sum', sequelize.col('sum')), 'sum'], 'nameProgram', 'idProgram']
    }

    _.set(query, 'where.dDoc', getDatePeriod(params, 'dateFrom', 'dateTo'))

    const data = await Model.findAll(query)

    return populateModelsByProgram(data)
  }

  return {
    findByProject,
    findByProgram,
    findByProjectOrProgram,
    getSumByFoundation,
    getSumByProject,
    getSumByProgram,
    getSumByProjectOrProgram,
    findOne,
    findAll,
    getFoundationExpensesByProject,
    getFoundationExpensesByPrograms,
  }
}
