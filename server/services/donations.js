/**
 * Module donations.js
 * Foundation donations service
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const _          = require('lodash')
const appRoot    = require('app-root-path').path
const path       = require('path')
const moment     = require('moment')
const BigNumber  = require('bignumber.js')
const keccak256  = require('js-sha3').keccak256
const validator  = require('../helpers/validators')
const dateHelper = require('../helpers/date-helpers')

const REPOSITORY_PATH = path.join(appRoot, 'server', 'repositories')

module.exports = (app) => {

  const sequelize = app.sequelize
  const i18n      = app.i18n

  const getRepository = () => {
    const repositoryPath = path.join(REPOSITORY_PATH, 'donations')
    const repository     = require(repositoryPath)
    return repository(sequelize)
  }

  async function getDonations (params) {
    const query = {}

    if (_.has(params, 'idFoundation')) {
      _.set(query, 'where.idFoundation', params.idFoundation)
    }
    if (_.has(params, 'donatorEmail')) {
      _.set(query, 'where.hashDonator', '0x' + keccak256(params.donatorEmail))
    }

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

    const totalSum = await repository.sum(query)
    return {
      count,
      totalCount,
      page,
      perPage,
      totalPages,
      items,
      totalSum,
    }
  }

  async function loadFromFile (filePath, params) {

    const handlers = {
      validate:  validateDonation,
      transform: transformDonation,
    }

    return await app.services.parse.parse(filePath, _.extend(handlers, params))
  }

  // Validate donation while parsing CSV file
  const validateDonation = (data) => {

    const dDoc         = data['DDOC']
    const nDoc         = data['NDOC']
    const idSource     = data['idDONATIONSOURCE']
    const emailDonator = data['emailDONATOR']
    const nameDonator  = data['nameDONATOR']
    const idTarget     = data['idCHARITYTARGET']
    const remark       = data['REMARK']
    const sum          = data['SUMMA']

    const emailMaxLength  = 64
    const nameMaxLength   = 255
    const remarkMaxLength = 255
    const nDocMaxLength   = 32

    if (validator.isEmpty(idTarget)) {
      return {field: 'idCHARITYTARGET', error: 'required'}
    }
    if (!validator.isId(idTarget)) {
      return {field: 'idCHARITYTARGET', error: 'invalid_id', type: 'numeric'}
    }

    if (validator.isEmpty(idSource)) {
      return {field: 'idDONATIONSOURCE', error: 'required'}
    }
    if (!validator.isId(idSource)) {
      return {field: 'idDONATIONSOURCE', error: 'invalid_id', type: 'numeric'}
    }

    if (!nameDonator && !emailDonator) {
      return {field: 'nameDONATOR', error: 'required'}
    }

    if (emailDonator) {
      // if (emailDonator && !validator.isEmail(emailDonator)) {
      //   return {field: 'emailDONATOR', error: 'invalid_email'}
      // }
      if (validator.isExceedLength(emailDonator, emailMaxLength)) {
        return {field: 'emailDONATOR', error: 'too_long', max: emailMaxLength}
      }
    }

    if (nameDonator && validator.isExceedLength(nameDonator, nameMaxLength)) {
      return {field: 'nameDONATOR', error: 'too_long', max: nameMaxLength}
    }

    if (validator.isEmpty(dDoc)) {
      return {field: 'DDOC', error: 'required'}
    }
    if (!validator.isDate(dDoc)) {
      return {field: 'DDOC', error: 'invalid_date'}
    }

    if (validator.isEmpty(sum)) {
      return {field: 'SUMMA', error: 'required'}
    }
    if (!validator.isFloat(sum)) {
      return {field: 'SUMMA', error: 'invalid_number'}
    }

    if (remark && validator.isExceedLength(remark, remarkMaxLength)) {
      return {field: 'remark', error: 'too_long', max: remarkMaxLength}
    }

    if (nDoc && validator.isExceedLength(nDoc, nDocMaxLength)) {
      return {field: 'NDOC', error: 'too_long', max: nDocMaxLength}
    }

    return true
  }

  // Transform donation data to model
  const transformDonation = (data) => {
    const dDoc         = data['DDOC']
    const nDoc         = data['NDOC'] || ''
    const idSource     = data['idDONATIONSOURCE']
    const emailDonator = data['emailDONATOR']
    const nameDonator  = data['nameDONATOR'] || ''
    const idTarget     = data['idCHARITYTARGET']
    const remark       = data['REMARK'] || ''
    const sum          = parseFloat(data['SUMMA'])

    if (!sum) {
      throw new Error(i18n.__('INVALID_SUM', data['SUMMA']))
    }

    return {dDoc, nDoc, idSource, emailDonator, nameDonator, idTarget, remark, sum}
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

  const checkTarget = (idTarget, idFoundation) => {
    if (!idTarget) {
      throw new Error(i18n.__('NO_TARGET_SPECIFIED'))
    }

    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    // Check if target exists
    const target = app.blockchain.targets.getByID(idFoundation, idTarget)
    if (target[2] === '') {
      logger.error('Target #%s in foundation #%s not found', idTarget, idFoundation)
      throw new Error(i18n.__('TARGET_IN_FOUNDATION_NOT_FOUND', idTarget, idFoundation))
    }
  }

  const checkSource = (idSource) => {
    if (!idSource) {
      throw new Error(i18n.__('NO_SOURCE_SPECIFIED'))
    }

    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    // Check if source exists
    const source = app.blockchain.donationSources.getByID(idSource)
    if (source[2] === '') {
      logger.error('Donation source #%s not found', idSource)
      throw new Error(i18n.__('SOURCE_NOT_FOUND', idSource))
    }
  }

  const findDonatorByEmail = (email) => {
    if (!email) {
      throw new Error(i18n.__('NO_EMAIL_SPECIFIED'))
    }

    const blockchain = app.blockchain
    blockchain.connect()

    // Check if source exists
    const ID        = app.blockchain.donators.getIDByEMail(email)
    const idDonator = ID.toString(10)
    return idDonator !== '0' ? idDonator : ''
  }

  /**
   * Pull donations from blockchain
   *
   * @param idFoundation {string}
   * @param date {string}
   * @param params {Object}
   *
   * @returns {Promise}
   *
   * @author  Marunin Alexey <amarunin@oneplus1.ru>
   * @since   0.1.0
   */
  async function pullDonationsFromBlockchain (idFoundation, date, params) {

    checkFoundation(idFoundation)

    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    const force = _.get(params, 'force', false)

    blockchain.connect()

    const dDoc = new Date(date)

    logger.info('Pulling donations for %s (foundation #%s)... ', moment(date).format('YYYY-MM-DD'), idFoundation)
    const yyyymmdd = dateHelper.date2yyyymmdd(dDoc)
    const events   = await app.blockchain.getDonationEvents(idFoundation, yyyymmdd)
    // if (events === null) {
    //   logger.warn('Attempting to fetch donation events again...')
    //   return pullDonationsFromBlockchain(idFoundation, date, params)
    // }

    const arr = app.blockchain.donations.getAllByDDOC(idFoundation, yyyymmdd)
    let items = _.map(arr, d => {
      const idDonation   = d[1].toString(10)
      const idFoundation = d[2].toString(10)
      const yyyymmdd     = d[3].toString(10)
      const nDoc         = d[4] || ''
      const idSource     = d[5].toString(10)
      const idTarget     = d[6].toString(10)
      const idDonator    = d[7].toString(10)
      const nameDonator  = d[8] || ''
      const remark       = d[9] || ''
      const sum          = d[10].div(100).toString(10)

      const txId = _.get(_.findLast(events, {idDonation}), 'txId', null)

      const donation = {
        idDonation,
        idDonator,
        nameDonator,
        idSource,
        sum,
        idFoundation,
        idTarget,
        nDoc,
        dDoc,
        remark,
        txId,
      }
      logger.info('%j', donation)
      return donation
    })

    logger.info('Found donations: %d', items.length)

    const transaction = await app.sequelize.transaction()

    const Model = app.sequelize.getModel('Donation')
    const where = {idFoundation, dDoc}
    try {
      if (force === true) {
        await Model.destroy({where, transaction})
        await Model.bulkCreate(items, {transaction})
      }
      else {
        // Insert only non-exist items
        const newItems = []
        const promises = _.map(items, item => {
          const idDonation = item.idDonation
          const where      = {idDonation, idFoundation}
          return Model.findOne({where}).then(model => {
            if (!model) {
              newItems.push(item)
            }
            return model
          })
        })
        await Promise.all(promises)

        if (newItems.length > 0) {
          await Model.bulkCreate(newItems, {transaction})
        }
        items = newItems
      }
      logger.info('Inserted donations: %d', items.length)
      await transaction.commit()
    }
    catch (exception) {
      await transaction.rollback()
    }

    return items
  }

  /**
   * Push donations to blockchain
   *
   * @param idFoundation {string}
   * @param items {Array}
   * @param params {Object}
   *
   * @returns {Promise.<*>}
   *
   * @author  Marunin Alexey <amarunin@oneplus1.ru>
   * @since   0.1.0
   */
  async function pushDonationsToBlockchain (idFoundation, items, params) {

    const sequelize  = app.sequelize
    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    checkFoundation(idFoundation)

    const pending = await blockchain.checkPendingTransactions({idFoundation})
    if (pending > 0) return {success: false, pending}

    const unlockTimeout = _.get(params, 'unlockTimeout', 3000)
    blockchain.unlock(unlockTimeout)

    logger.info('Pushing donations to blockchain (foundation ID=%s)...', idFoundation)
    // const total = app.blockchain.donations.itemCount()
    // logger.info('  found: %d', total)

    const pushedItems     = []
    const tableName       = sequelize.getModel('Donation').tableName
    const addNewDonations = (donations, dDoc) => {
      const yyyymmdd = dateHelper.date2yyyymmdd(dDoc)
      logger.info('%s', yyyymmdd)
      const arr = blockchain.donations.getAllByDDOC(idFoundation, yyyymmdd)
      logger.info('%d/%d', arr.length, donations.length)
      if (arr.length > 0) return []
      return _.map(donations, donation => {
        checkTarget(donation.idTarget, idFoundation)
        checkSource(donation.idSource, idFoundation)

        // Find donator by email
        const idDonator = donation.emailDonator ? findDonatorByEmail(donation.emailDonator) : ''

        logger.info('Pushing new donation at %s by %s (sum=%s)...', donation.nameDonator || donation.emailDonator, donation.dDoc, donation.sum)
        const sum100 = (new BigNumber(donation.sum)).mul(100, 10).toString(10)
        let txId
        for (let attempt = 1; attempt < 5; attempt++) {
          try {
            txId = blockchain.donations.add(idFoundation, yyyymmdd, donation.nDoc, donation.idSource,
              donation.idTarget, idDonator, donation.nameDonator, donation.remark, sum100)
            break
          }
          catch (exception) {
            logger.error(exception)
            logger.warn('Attempting to add donation again...')
          }
        }
        pushedItems.push(donation)

        return blockchain.addTransaction(txId, {idFoundation, tableName})
      })
    }

    const promises = _.chain(items)
      .groupBy('dDoc')
      .flatMap(addNewDonations)
      .value()

    await Promise.all(promises)

    app.blockchain.lock()

    logger.info('Total pushed donations: %d', pushedItems.length)

    return {success: true, items: pushedItems}
  }

  return {
    getRepository,
    getDonations,
    loadFromFile,
    pullDonationsFromBlockchain,
    pushDonationsToBlockchain,
  }

}
