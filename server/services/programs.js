/**
 * Module programs.js
 * Foundation programs service
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
    const repositoryPath = path.join(REPOSITORY_PATH, 'programs')
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

  async function getAllPrograms (params) {

    const query = {}

    if (_.has(params, 'name')) {
      _.set(query, 'where.name', {like: '%' + params.name + '%'})
    }
    if (_.has(params, 'idFoundation')) {
      _.set(query, 'where.idFoundation', params.idFoundation)
    }

    _.set(query, 'include', [
      {model: sequelize.getModel('Foundation'), as: 'foundation'},
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

  async function getProgramDetails (idFoundation, idProgram, params) {
    if (!idFoundation && !idProgram)
      return null

    const dateFrom           = _.has(params, 'dateFrom') ? moment.utc(params.dateFrom, 'YYYY.MM.DD').toDate() : false
    const dateTo             = _.has(params, 'dateTo') ? moment.utc(params.dateTo, 'YYYY.MM.DD').toDate() : false
    const donatorEmail       = _.has(params, 'donatorEmail') ? params.donatorEmail : false
    const isMyDonationsOnTop = _.has(params, 'isMyDonationsOnTop') ? params.isMyDonationsOnTop : false

    const repository = getRepository()
    const program    = await repository.findById(idFoundation, idProgram)

    if (!program)
      return null

    const donationRepository = getDonationRepository()
    const expenseRepository  = getExpenseRepository()

    const userDonator = donatorEmail ? await Donator.buildQuery({email: donatorEmail}).one() : false

    const donations = await donationRepository.findByProgram(idFoundation, idProgram, {
      dateFrom,
      dateTo,
      userDonator,
      isMyDonationsOnTop
    })

    const totalDonations = await donationRepository.getSumByProgram(idFoundation, idProgram, {dateFrom, dateTo})
    const expenses       = await expenseRepository.findByProgram(idFoundation, idProgram, {dateFrom, dateTo})
    const totalExpenses  = await expenseRepository.getSumByProgram(idFoundation, idProgram, {dateFrom, dateTo})

    return {
      program,
      donations,
      totalDonations,
      expenses,
      totalExpenses,
    }
  }

  // Validate program while parsing CSV file
  const validateProgram = (data) => {

    const idProgram = data['ID']
    const name      = data['NAME']
    const website   = data['WEBSITE']

    const nameMaxLength    = 255
    const websiteMaxLength = 255

    if (validator.isEmpty(idProgram)) {
      return {field: 'ID', error: 'required'}
    }
    if (!validator.isId(idProgram)) {
      return {field: 'ID', error: 'invalid_id', type: 'numeric'}
    }
    if (validator.isEmpty(name)) {
      return {field: 'NAME', error: 'required'}
    }

    if (validator.isExceedLength(name, nameMaxLength)) {
      return {field: 'NAME', error: 'too_long', max: nameMaxLength}
    }

    if (validator.isExceedLength(website, websiteMaxLength)) {
      return {field: 'WEBSITE', error: 'too_long', max: websiteMaxLength}
    }

    return true
  }

  // Transform program data to model
  const transformProgram = (data) => {
    const idProgram = data['ID']
    const name      = data['NAME']
    const website   = data['WEBSITE']

    return {idProgram, name, website}
  }

  const checkFoundation = (idFoundation) => {
    if (!idFoundation) {
      throw new Error(i18n.__('NO_FOUNDATION_SPECIFIED'))
    }

    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    // Check if foundation exists
    const foundation = app.blockchain.foundations.getByID(idFoundation)
    if (foundation[2] === '') {
      logger.error('Foundation %s not found', idFoundation)
      throw new Error(i18n.__('FOUNDATION_NOT_FOUND', idFoundation))
    }
  }

  async function loadFromFile (filePath, params) {

    const handlers = {
      validate:  validateProgram,
      transform: transformProgram,
    }

    return await app.services.parse.parse(filePath, _.extend(handlers, params))
  }

  function pullProgramWebsite (idFoundation, idProgram) {
    const section = 'program-' + idFoundation + '-' + idProgram
    const key     = 'program-website'

    return app.blockchain.keyValueStorage.get(section, key)
  }

  async function pushProgramWebsite (idFoundation, idProgram, website) {
    const section   = 'program-' + idFoundation + '-' + idProgram
    const key       = 'program-website'
    const txId      = app.blockchain.keyValueStorage.upsert(section, key, website)
    const tableName = sequelize.getModel('Program').tableName

    return app.blockchain.addTransaction(txId, {idFoundation, tableName})
  }

  function pullProgram (idFoundation, data) {
    const logger = app.getLogger('blockchain')

    const idProgram = data[1].toString(10)
    const name      = data[2]
    const website   = pullProgramWebsite(idFoundation, idProgram)

    const program = {idProgram, name, idFoundation, website}
    logger.info('%j', program)
    return program
  }

  /**
   * Pull programs specified foundation from blockchain
   *
   * @param idFoundation {string}
   * @param params {Object}
   *
   * @returns {Promise}
   *
   * @author  Marunin Alexey <amarunin@oneplus1.ru>
   * @since   0.1.0
   */
  async function pullProgramsFromBlockchain (idFoundation, params) {

    checkFoundation(idFoundation)

    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    logger.info('Pulling programs (foundation #%s)... ', idFoundation)
    const total = app.blockchain.programs.getCountByCharityFoundation(idFoundation)
    logger.info('  found: %d', total)
    const arr   = app.blockchain.programs.getAll(idFoundation)
    const items = _.map(arr, d => {
      return pullProgram(idFoundation, d)
    })

    logger.info('Found programs: %d', items.length)

    const transaction = await app.sequelize.transaction()

    const Model = app.sequelize.getModel('Program')
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

  async function pushProgramsToBlockchain (idFoundation, items, params) {

    const sequelize  = app.sequelize
    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    checkFoundation(idFoundation)

    const pending = await blockchain.checkPendingTransactions({idFoundation})
    if (pending > 0) return {success: false, pending}

    const unlockTimeout = _.get(params, 'unlockTimeout')
    blockchain.unlock(unlockTimeout)
    logger.info('Pushing programs to blockchain (foundation ID=%s)...', idFoundation)
    const pushedItems = []

    const promises = []
    _.chain(items)
      .filter(item => {
        const exists = blockchain.programs.exists(idFoundation, item.idProgram)
        if (exists) {
          logger.info('Program #%s "%s" skipped (exists)', item.idProgram, item.name)
        }
        return !exists
      })
      .each(item => {
        logger.info('Pushing new program %s (#%s)...', item.name, item.idProgram)
        const txId = blockchain.programs.add(idFoundation, item.idProgram, item.name)
        pushedItems.push(item)
        const tableName = sequelize.getModel('Program').tableName
        const tx1       = blockchain.addTransaction(txId, {idFoundation, tableName})
        const tx2       = pushProgramWebsite(idFoundation, item.idProgram, item.website)
        promises.push(tx1)
        promises.push(tx2)
      })
      .value()

    await Promise.all(promises)

    app.blockchain.lock()

    logger.info('Total pushed programs: %d', pushedItems.length)

    return {success: true, items: pushedItems}
  }

  return {
    getAllPrograms,
    getProgramDetails,
    getRepository,
    loadFromFile,
    pullProgramsFromBlockchain,
    pushProgramsToBlockchain,
  }

}
