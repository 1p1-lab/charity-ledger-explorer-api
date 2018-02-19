/**
 * Module donations.js
 * Foundation donations repository
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const _         = require('lodash')
const Sequelize = require('sequelize')
const Op        = Sequelize.Op
const moment    = require('moment')

module.exports = (sequelize) => {
  const Model = sequelize.getModel('DonationView')

  const populateModel = (model, params) => {
    if (!model) return {}
    return {
      idDonation:     model.idDonation,
      sum:            model.sum,
      idDonator:      model.idDonator,
      nameDonator:    model.anonDonator,
      isPerson:       model.isPerson,
      idFoundation:   model.idFoundation,
      nameFoundation: model.nameFoundation,
      idProject:      model.idProject,
      nameProject:    model.nameProject,
      idProgram:      model.idProgram,
      nameProgram:    model.nameProgram,
      idTarget:       model.idTarget,
      nameTarget:     model.nameTarget,
      idSource:       model.idSource,
      nameSource:     model.nameSource,
      nDoc:           model.nDoc,
      dDoc:           model.dDoc,
      remark:         model.remark,
      txId:           model.txId,
      isMyDonation:   (params && params.userDonatorId && params.userDonatorId == model.idDonator ? 1 : 0),
    }
  }

  const populateModelByTarget = (model) => {
    if (!model) return {}
    return {
      id:     model.idTarget,
      amount: model.sum,
      name:   model.nameTarget,
    }
  }

  const populateModels = (models, params) => {
    return _.map(models, model => {
      return populateModel(model, params)
    })
  }

  async function findAll (query, params) {
    const donations = await Model.findAll(query)
    return populateModels(donations, params)
  }

  async function findAndCountAll (query) {
    const result = await Model.findAndCountAll(query)
    const count  = result.count
    const items  = populateModels(result.rows)
    return {count, items}
  }

  async function findOne (query) {
    const donation = await Model.findOne(query)
    return populateModel(donation)
  }

  const populateModelsByTarget = (models) => {
    return _.map(models, model => {
      return populateModelByTarget(model)
    })
  }

  const getDatePeriod = (params, dateFromName, dateToName) => {
    if (_.has(params, dateFromName) && _.get(params, dateFromName) &&
      _.has(params, dateToName) && _.get(params, dateToName)) {
      return {[Op.gte]: _.get(params, dateFromName), [Op.lte]: _.get(params, dateToName)}
    }
    else {
      if (_.has(params, dateFromName) && _.get(params, dateFromName)) {
        return {[Op.gte]: _.get(params, dateFromName)}
      }

      if (_.has(params, dateToName) && _.get(params, dateToName)) {
        return {[Op.lte]: _.get(params, dateToName)}
      }

      return {}
    }
  }

  const getDatePeriodSQL = (params, dateFieldName, dateFromName, dateToName) => {

    let dateFrom = _.has(params, dateFromName) && _.get(params, dateFromName) ? _.get(params, dateFromName) : false
    let dateTo   = _.has(params, dateToName) && _.get(params, dateToName) ? _.get(params, dateToName) : false

    if (dateFrom) {
      dateFrom = '"' + moment.utc(dateFrom, 'YYYY.MM.DD').toISOString() + '"'
    }

    if (dateTo) {
      dateTo = '"' + moment.utc(dateTo, 'YYYY.MM.DD').toISOString() + '"'
    }

    if (dateFrom && dateTo) {

      return ' (' +
        dateFieldName + ' >= ' + dateFrom + ' and ' +
        dateFieldName + ' <= ' + dateTo +
        ') '

    }
    else {
      if (dateFrom) {
        return ' (' + dateFieldName + ' >= ' + dateFrom + ') '
      }

      if (dateTo) {

        return ' (' + dateFieldName + ' >= ' + dateTo + ') '

      }

      return ''
    }
  }

  async function count (query) {
    const count = await Model.count(query)
    return (!_.isNaN(count) && _.isNumber(count) ? parseInt(count) : 0)
  }

  async function sum (query) {
    const sum = await Model.sum('sum', query)
    return (!_.isNaN(sum) && _.isNumber(sum) ? Math.round(sum * 1000) / 1000 : 0)
  }

  async function getSumByFoundation (idFoundation, params) {
    const dDoc  = getDatePeriod(params, 'dateFrom', 'dateTo')
    const where = {idFoundation, dDoc}
    const query = {where}
    return await sum(query)
  }

  async function findByProject (idFoundation, idProject, params) {
    const dDoc  = getDatePeriod(params, 'dateFrom', 'dateTo')
    const where = {idFoundation, idProject, dDoc}
    const query = {where}
    const order = []

    const idDonator = _.get(params, 'userDonator.idDonator', 0)
    if (idDonator) {
      const isMyDonation = [sequelize.literal('(CASE WHEN `idDonator` = \'' + idDonator + '\' THEN 1 ELSE 0 END)'), 'isMyDonation']
      _.set(query, 'attributes', {include: [isMyDonation]})
      // Show user donations on top
      const isMyDonationsOnTop = _.get(params, 'isMyDonationsOnTop', true)
      if (isMyDonationsOnTop) {
        order.push([sequelize.col('isMyDonation'), 'DESC'])
      }
    }

    // Default order
    order.push(['dDoc', 'DESC'])

    _.set(query, 'order', order)

    return await findAll(query, {userDonatorId: idDonator})
  }

  async function getSumByProject (idFoundation, idProject, params) {
    const dDoc  = getDatePeriod(params, 'dateFrom', 'dateTo')
    const where = {idFoundation, idProject, dDoc}
    const query = {where}
    return await sum(query)
  }

  async function findByProgram (idFoundation, idProgram, params) {
    const dDoc  = getDatePeriod(params, 'dateFrom', 'dateTo')
    const where = {idFoundation, idProgram, dDoc}
    const query = {where}
    const order = []

    const idDonator = _.get(params, 'userDonator.idDonator', 0)
    if (idDonator) {
      const isMyDonation = [sequelize.literal('(CASE WHEN `idDonator` = \'' + idDonator + '\' THEN 1 ELSE 0 END)'), 'isMyDonation']
      _.set(query, 'attributes', {include: [isMyDonation]})
      // Show user donations on top
      const isMyDonationsOnTop = _.get(params, 'isMyDonationsOnTop', true)
      if (isMyDonationsOnTop) {
        order.push([sequelize.col('isMyDonation'), 'DESC'])
      }
    }
    // Default order
    order.push(['dDoc', 'DESC'])

    _.set(query, 'order', order)

    return await findAll(query, {userDonatorId: idDonator})
  }

  async function getSumByProgram (idFoundation, idProgram, params) {
    const dDoc  = getDatePeriod(params, 'dateFrom', 'dateTo')
    const where = {idFoundation, idProgram, dDoc}
    const query = {where}
    return await sum(query)
  }

  async function findByTarget (idFoundation, idTarget, params) {
    const dDoc  = getDatePeriod(params, 'dateFrom', 'dateTo')
    const where = {idFoundation, idTarget, dDoc}
    const query = {where}
    const order = []

    const idDonator = _.get(params, 'userDonator.idDonator', 0)
    if (idDonator) {
      const isMyDonation = [sequelize.literal('(CASE WHEN `idDonator` = \'' + idDonator + '\' THEN 1 ELSE 0 END)'), 'isMyDonation']
      _.set(query, 'attributes', {include: [isMyDonation]})
      // Show user donations on top
      const isMyDonationsOnTop = _.get(params, 'isMyDonationsOnTop', true)
      if (isMyDonationsOnTop) {
        order.push([sequelize.col('isMyDonation'), 'DESC'])
      }
    }

    // Default order
    order.push(['dDoc', 'DESC'])

    _.set(query, 'order', order)

    return await findAll(query, {userDonatorId: idDonator})
  }

  async function getSumByTarget (idFoundation, idTarget, params) {
    const query = {where: {idFoundation, idTarget}}
    _.set(query, 'where.dDoc', getDatePeriod(params, 'dateFrom', 'dateTo'))
    return await sum(query)
  }

  async function getFoundationDonationsByTarget (idFoundation, params) {

    const query = {
      where:      {
        idFoundation,
        idTarget: {[Op.ne]: null}
      },
      group:      'idTarget',
      attributes: [[sequelize.fn('sum', sequelize.col('sum')), 'sum'], 'nameTarget', 'idTarget']
    }

    _.set(query, 'where.dDoc', getDatePeriod(params, 'dateFrom', 'dateTo'))

    const data = await Model.findAll(query)

    return populateModelsByTarget(data)
  }

  return {
    findByProject,
    findByProgram,
    findByTarget,
    getSumByFoundation,
    getSumByProject,
    getSumByProgram,
    getSumByTarget,
    findOne,
    findAll,
    findAndCountAll,
    count,
    sum,
    getFoundationDonationsByTarget,
  }
}
