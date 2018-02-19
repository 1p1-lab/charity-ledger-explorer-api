/**
 * Module costs.js
 * Foundation costs service
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const _         = require('lodash')
const appRoot   = require('app-root-path').path
const path      = require('path')
const validator = require('../helpers/validators')

const REPOSITORY_PATH = path.join(appRoot, 'server', 'repositories')

module.exports = (app) => {

  const sequelize = app.sequelize
  const i18n      = app.i18n

  const getRepository = () => {
    const repositoryPath = path.join(REPOSITORY_PATH, 'costs')
    const repository     = require(repositoryPath)
    return repository(sequelize)
  }

  async function getAllCostItems (params) {

    const query = {}

    // Filter
    if (_.has(params, 'name')) {
      _.set(query, 'where.name', {like: '%' + params.name + '%'})
    }
    if (_.has(params, 'idFoundation')) {
      _.set(query, 'where.idFoundation', params.idFoundation)
    }

    _.set(query, 'include', [
      {model: sequelize.getModel('Foundation'), as: 'foundation'},
    ])

    // Pagination
    let limit = _.get(query, 'limit', 20)
    limit     = parseInt(limit)
    if (!_.isNumber(limit) || limit <= 0) {
      limit = 20
    }
    if (limit) _.set(query, 'limit', limit)

    // Current page
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

  async function getCostItemDetails (idFoundation, idCostItem) {
    const repository = getRepository()
    const costItem   = await repository.findById(idFoundation, idCostItem)
    if (!costItem) return null

    return {
      costItem,
    }
  }

  // Validate cost while parsing CSV file
  const validateCostItem = (data) => {

    const idCostItem = data['ID']
    const name       = data['NAME']

    const nameMaxLength = 255

    if (validator.isEmpty(idCostItem)) {
      return {field: 'ID', error: 'required'}
    }
    if (!validator.isId(idCostItem)) {
      return {field: 'ID', error: 'invalid_id', type: 'numeric'}
    }
    if (validator.isEmpty(name)) {
      return {field: 'name', error: 'required'}
    }

    if (validator.isExceedLength(name, nameMaxLength)) {
      return {field: 'name', error: 'too_long', max: nameMaxLength}
    }
    return true
  }

  // Transform cost item data to model
  const transformCostItem = (data) => {
    const idCostItem = data['ID']
    const name       = data['NAME']

    return {idCostItem, name}
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
      validate:  validateCostItem,
      transform: transformCostItem,
    }

    return await app.services.parse.parse(filePath, _.extend(handlers, params))
  }

  /**
   * Pull cost items specified foundation from blockchain
   *
   * @param idFoundation {string}
   * @param params {Object}
   *
   * @returns {Promise}
   *
   * @author  Marunin Alexey <amarunin@oneplus1.ru>
   * @since   0.1.0
   */
  async function pullCostItemsFromBlockchain (idFoundation, params) {

    checkFoundation(idFoundation)

    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    logger.info('Pulling cost items (foundation #%s)... ', idFoundation)
    const total = app.blockchain.costItems.getCountByCharityFoundation(idFoundation)
    logger.info('  found: %d', total)
    const arr   = app.blockchain.costItems.getAll(idFoundation)
    const items = _.map(arr, d => {
      const idCostItem = d[1].toString(10)
      const name       = d[2]
      const costItem   = {idCostItem, name, idFoundation}
      logger.info('%j', costItem)
      return costItem
    })

    logger.info('Found cost items: %d', items.length)

    const transaction = await app.sequelize.transaction()

    const Model = app.sequelize.getModel('CostItem')
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

  async function pushCostItemsToBlockchain (idFoundation, items, params) {

    const sequelize  = app.sequelize
    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    checkFoundation(idFoundation)

    const pending = await blockchain.checkPendingTransactions({idFoundation})
    if (pending > 0) return {success: false, pending}

    const unlockTimeout = _.get(params, 'unlockTimeout')
    blockchain.unlock(unlockTimeout)
    logger.info('Pushing cost items to blockchain (foundation ID=%s)...', idFoundation)
    const pushedItems = []
    const promises    = _.map(items, item => {
      const arr    = blockchain.costItems.getByID(idFoundation, item.idCostItem)
      const exists = (arr[2] !== '')
      if (exists) {
        logger.info('Cost item #%s "%s" skipped', item.idCostItem, item.name)
      }
      else {
        logger.info('Pushing new cost item %s (#%s)...', item.name, item.idCostItem)
        const txId = blockchain.costItems.add(idFoundation, item.idCostItem, item.name)
        pushedItems.push(item)
        const tableName = sequelize.getModel('CostItem').tableName
        return blockchain.addTransaction(txId, {idFoundation, tableName})
      }
    })
    await Promise.all(promises)

    app.blockchain.lock()

    logger.info('Total pushed cost items: %d', pushedItems.length)

    return {success: true, items: pushedItems}
  }

  return {
    getAllCostItems,
    getCostItemDetails,
    getRepository,
    loadFromFile,
    pullCostItemsFromBlockchain,
    pushCostItemsToBlockchain,
  }

}
