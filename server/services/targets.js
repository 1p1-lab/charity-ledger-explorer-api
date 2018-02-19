/**
 * Module targets.js
 * Foundation targets service
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const _         = require('lodash')
const appRoot   = require('app-root-path').path
const path      = require('path')
const validator = require('../helpers/validators')
const moment    = require('moment')

const REPOSITORY_PATH = path.join(appRoot, 'server', 'repositories')

module.exports = (app) => {

  const sequelize = app.sequelize
  const i18n      = app.i18n
  const Donator   = sequelize.getModel('Donator')

  const getRepository = () => {
    const repositoryPath = path.join(REPOSITORY_PATH, 'targets')
    const repository     = require(repositoryPath)
    return repository(sequelize)
  }

  const getDonationRepository = () => {
    const repositoryPath = path.join(REPOSITORY_PATH, 'donations')
    const repository     = require(repositoryPath)
    return repository(sequelize)
  }

  const getExpenseRepository = () => {
    const repositoryPath = path.join(REPOSITORY_PATH, 'expenses')
    const repository     = require(repositoryPath)
    return repository(sequelize)
  }

  async function getAllTargets (params) {

    const query = {}

    if (_.has(params, 'name')) {
      _.set(query, 'where.name', {like: '%' + params.name + '%'})
    }
    if (_.has(params, 'idFoundation')) {
      _.set(query, 'where.idFoundation', params.idFoundation)
    }

    _.set(query, 'include', [
      {model: sequelize.getModel('Foundation'), as: 'foundation'},
      {model: sequelize.getModel('Project'), as: 'project'},
      {model: sequelize.getModel('Program'), as: 'program'},
    ])

    let limit = _.get(query, 'limit', 20)
    limit     = parseInt(limit)
    if (!_.isNumber(limit) || limit <= 0) {
      limit = 20
    }
    if (limit) _.set(query, 'limit', limit)

    let offset = 0
    let page   = _.get(query, 'page', 1)
    page       = parseInt(page)
    if (_.isNumber(page) && page >= 0) {
      if (page === 0) {
        page = 1
      }
      offset = (page - 1) * limit
    }
    if (offset) _.set(query, 'offset', offset)

    const repository = getRepository()
    const totalCount = await repository.count()
    const result     = await repository.findAndCountAll(query)
    const count      = result.count
    const items      = result.items
    const perPage    = limit

    const ceilPages = (count, limit) => {
      return (count % limit ? parseInt(count / limit) + 1 : count / limit)
    }

    let totalPages = (count > 0 ? ceilPages(count, limit) : 0)

    if (totalPages === 0 && count > 0) {
      totalPages = 1
    }
    if (count === 0) {
      page = 0
    }

    return {
      count,
      totalCount,
      page,
      perPage,
      totalPages,
      items,
    }
  }

  async function getTargetDetails (idFoundation, idTarget, params) {
    if (!idFoundation && !idTarget)
      return null

    const dateFrom           = _.has(params, 'dateFrom') ? moment.utc(params.dateFrom, 'YYYY.MM.DD').toDate() : false
    const dateTo             = _.has(params, 'dateTo') ? moment.utc(params.dateTo, 'YYYY.MM.DD').toDate() : false
    const donatorEmail       = _.has(params, 'donatorEmail') ? params.donatorEmail : false
    const isMyDonationsOnTop = _.has(params, 'isMyDonationsOnTop') ? params.isMyDonationsOnTop : false

    const repository = getRepository()
    const target     = await repository.findById(idFoundation, idTarget)

    if (!target)
      return null

    const donationRepository = getDonationRepository()
    const expenseRepository  = getExpenseRepository()

    const userDonator = donatorEmail ? await Donator.buildQuery({email: donatorEmail}).one() : false

    const donations = await donationRepository.findByTarget(idFoundation, idTarget, {
      dateFrom,
      dateTo,
      userDonator,
      isMyDonationsOnTop
    })

    const totalDonations = await donationRepository.getSumByTarget(idFoundation, idTarget, {dateFrom, dateTo})
    const expenses       = await expenseRepository.findByProjectOrProgram(idFoundation, target.idProject, target.idProgram, {
      dateFrom,
      dateTo
    })
    const totalExpenses  = await expenseRepository.getSumByProjectOrProgram(idFoundation, target.idProject, target.idProgram, {
      dateFrom,
      dateTo
    })

    return {
      target,
      donations,
      totalDonations,
      expenses,
      totalExpenses,
    }
  }

  // Validate target while parsing CSV file
  const validateTarget = (data) => {

    const idTarget  = data['ID']
    const name      = data['NAME']
    const idProject = data['idPROJECT']
    const idProgram = data['idPROGRAM']
    const website   = data['WEBSITE']

    const nameMaxLength    = 255
    const websiteMaxLength = 255

    if (validator.isEmpty(idTarget)) {
      return {field: 'ID', error: 'required'}
    }
    if (!validator.isId(idTarget)) {
      return {field: 'ID', error: 'invalid_id', type: 'numeric'}
    }

    if (validator.isEmpty(name)) {
      return {field: 'NAME', error: 'required'}
    }
    if (validator.isExceedLength(name, nameMaxLength)) {
      return {field: 'NAME', error: 'too_long', max: nameMaxLength}
    }

    if (!idProject && !idProgram) {
      return {field: 'idPROJECT', error: 'required'}
    }

    if (idProject) {
      if (validator.isEmpty(idProject)) {
        return {field: 'idPROJECT', error: 'required'}
      }
      if (!validator.isId(idProject)) {
        return {field: 'idPROJECT', error: 'invalid_id', type: 'numeric'}
      }
    }

    if (idProgram) {
      if (validator.isEmpty(idProgram)) {
        return {field: 'idPROGRAM', error: 'required'}
      }
      if (!validator.isId(idProgram)) {
        return {field: 'idPROGRAM', error: 'invalid_id', type: 'numeric'}
      }
    }

    if (validator.isExceedLength(website, websiteMaxLength)) {
      return {field: 'WEBSITE', error: 'too_long', max: websiteMaxLength}
    }

    return true
  }

  // Transform target data to model
  const transformTarget = (data) => {
    const idTarget  = data['ID']
    const name      = data['NAME']
    const idProject = data['idPROJECT']
    const idProgram = data['idPROGRAM']
    const website   = data['WEBSITE']

    return {idTarget, name, idProject, idProgram, website}
  }

  const checkFoundation = (idFoundation) => {
    if (!idFoundation) {
      throw new Error('No foundation specified')
    }

    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    // Check if foundation exists
    const foundation = app.blockchain.foundations.getByID(idFoundation)
    if (foundation[2] === '') {
      logger.error('Foundation %s not found', idFoundation)
      throw new Error(i18n.__('NO_FOUNDATION_SPECIFIED'))
    }
  }

  const checkProject = (idProject, idFoundation) => {
    if (!idProject) return

    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    // Check if project exists
    const project = app.blockchain.projects.getByID(idFoundation, idProject)
    if (project[2] === '') {
      logger.error('Project #%s in foundation #%s not found', idProject, idFoundation)
      throw new Error(i18n.__('Проект %s не найден в фонде %s', idProject, idFoundation))
    }
  }

  const checkProgram = (idProgram, idFoundation) => {
    if (!idProgram) return

    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    // Check if program exists
    const program = app.blockchain.programs.getByID(idFoundation, idProgram)
    if (program[2] === '') {
      logger.error('Program #%s in foundation #%s not found', idProgram, idFoundation)
      throw new Error(i18n.__('Программа %s не найдена в фонде %s', idProgram, idFoundation))
    }
  }

  async function loadFromFile (filePath, params) {

    const handlers = {
      validate:  validateTarget,
      transform: transformTarget,
    }

    return await app.services.parse.parse(filePath, _.extend(handlers, params))
  }

  function pullTargetWebsite (idFoundation, idTarget) {
    const section = 'target-' + idFoundation + '-' + idTarget
    const key     = 'target-website'

    return app.blockchain.keyValueStorage.get(section, key)
  }

  async function pushTargetWebsite (idFoundation, idTarget, website) {
    const section   = 'target-' + idFoundation + '-' + idTarget
    const key       = 'target-website'
    const txId      = app.blockchain.keyValueStorage.upsert(section, key, website)
    const tableName = sequelize.getModel('Target').tableName

    return app.blockchain.addTransaction(txId, {idFoundation, tableName})
  }

  function pullTarget (idFoundation, data) {
    const logger = app.getLogger('blockchain')

    const idTarget  = data[1].toString(10)
    const name      = data[2]
    const idProgram = data[3].toString(10)
    const idProject = data[4].toString(10)
    const website   = pullTargetWebsite(idFoundation, idTarget)

    const target = {idTarget, name, idFoundation, idProject, idProgram, website}
    logger.info('%j', target)
    return target
  }

  /**
   * Pull targets specified foundation from blockchain
   *
   * @param idFoundation {string}
   * @param params {Object}
   *
   * @returns {Promise}
   *
   * @author  Marunin Alexey <amarunin@oneplus1.ru>
   * @since   0.1.0
   */
  async function pullTargetsFromBlockchain (idFoundation, params) {

    checkFoundation(idFoundation)

    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    logger.info('Pulling targets (foundation #%s)... ', idFoundation)
    const total = app.blockchain.targets.getCountByCharityFoundation(idFoundation)
    logger.info('  found: %d', total)
    const arr   = app.blockchain.targets.getAll(idFoundation)
    const items = _.map(arr, d => {
      return pullTarget(idFoundation, d)
    })

    logger.info('Found targets: %d', items.length)

    const transaction = await app.sequelize.transaction()

    const Model = app.sequelize.getModel('Target')
    const where = {idFoundation}
    try {
      await Model.destroy({where, transaction})
      await Model.bulkCreate(items, {transaction})
      await transaction.commit()
    }
    catch (exception) {
      await transaction.rollback()
    }

    return items
  }

  async function pushTargetsToBlockchain (idFoundation, items, params) {

    const sequelize  = app.sequelize
    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    checkFoundation(idFoundation)

    const pending = await blockchain.checkPendingTransactions({idFoundation})
    if (pending > 0) return {success: false, pending}

    const unlockTimeout = _.get(params, 'unlockTimeout')
    blockchain.unlock(unlockTimeout)
    logger.info('Pushing targets to blockchain (foundation ID=%s)...', idFoundation)
    const pushedItems = []

    const promises = []
    _.chain(items)
      .filter(item => {
        const exists = blockchain.targets.exists(idFoundation, item.idTarget)
        if (exists) {
          logger.info('Target #%s "%s" skipped (exists)', item.idTarget, item.name)
        }
        return !exists
      })
      .each(item => {
        checkProject(item.idProject, idFoundation)
        checkProgram(item.idProgram, idFoundation)
        logger.info('Pushing new target %s (#%s)...', item.name, item.idTarget)
        const txId = blockchain.targets.add(idFoundation, item.idTarget, item.name, item.idProgram, item.idProject)
        pushedItems.push(item)
        const tableName = sequelize.getModel('Target').tableName
        const tx1       = blockchain.addTransaction(txId, {idFoundation, tableName})
        const tx2       = pushTargetWebsite(idFoundation, item.idTarget, item.website)
        promises.push(tx1)
        promises.push(tx2)
      })
      .value()

    await Promise.all(promises)

    app.blockchain.lock()

    logger.info('Total pushed targets: %d', pushedItems.length)

    return {success: true, items: pushedItems}
  }

  return {
    getAllTargets,
    getTargetDetails,
    getRepository,
    loadFromFile,
    pushTargetsToBlockchain,
    pullTargetsFromBlockchain,
  }

}
