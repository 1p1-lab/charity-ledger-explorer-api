/**
 * Module donators.js
 * Donators service
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const _         = require('lodash')
const appRoot   = require('app-root-path').path
const path      = require('path')
const validator = require('../helpers/validators')

const REPOSITORY_PATH = path.join(appRoot, 'server', 'repositories')

const keccak256 = require('js-sha3').keccak256

const cryptEmail = (email) => {
  return '0x' + keccak256(email)
}

module.exports = (app) => {

  const sequelize = app.sequelize
  const i18n      = app.i18n

  const getRepository = () => {
    const repositoryPath = path.join(REPOSITORY_PATH, 'donators')
    const repository     = require(repositoryPath)
    return repository(sequelize)
  }

  // Validate donator while parsing CSV file
  const validateDonator = (data) => {

    const name  = data['nameDONATOR']
    const email = data['emailDONATOR']

    const nameMaxLength  = 255
    const emailMaxLength = 64

    if (!name && !email) {
      return {field: 'nameDONATOR', error: 'required'}
    }

    if (email) {
      // if (email && !validator.isEmail(email)) {
      //   return {field: 'emailDONATOR', error: 'invalid_email'}
      // }
      if (validator.isExceedLength(email, emailMaxLength)) {
        return {field: 'emailDONATOR', error: 'too_long', max: emailMaxLength}
      }
    }

    if (name && validator.isExceedLength(name, nameMaxLength)) {
      return {field: 'nameDONATOR', error: 'too_long', max: nameMaxLength}
    }

    return true
  }

  // Transform donator data to model
  const transformDonator = (data) => {
    const name     = data['nameDONATOR'] || ''
    const email    = data['emailDONATOR'] || ''
    const isPerson = false
    const contact  = ''

    const hashEMail = email ? cryptEmail(email) : void 0

    return {name, hashEMail, email, contact, isPerson}
  }

  async function loadFromFile (filePath, params) {

    const handlers = {
      validate:  validateDonator,
      transform: transformDonator,
    }

    const result = await app.services.parse.parse(filePath, _.extend(handlers, params))
    if (result.items) {
      const items = _.chain(result.items || [])
        .filter('email')
        .uniqBy('email')
        .value()

      _.set(result, 'items', items)
    }

    return result

  }

  /**
   * Pull donators from blockchain
   *
   * @param params {Object}
   *
   * @returns {Promise}
   *
   * @author  Marunin Alexey <amarunin@oneplus1.ru>
   * @since   0.1.0
   */
  async function pullDonatorsFromBlockchain (params) {

    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    logger.info('Pulling donators... ')
    const total = app.blockchain.donators.itemCount()
    logger.info('  found: %d', total)
    const arr   = app.blockchain.donators.getAll()
    const items = _.map(arr, d => {
      const idDonator = d[1].toString(10)
      const name      = d[2]
      const hashEMail = d[3]
      const contact   = d[4] || '' // magic
      const isPerson  = d[5]

      const donator = {idDonator, name, hashEMail, contact, isPerson}
      logger.info('%j', donator)
      return donator
    })

    logger.info('Found donators: %d', items.length)

    const transaction = await app.sequelize.transaction()

    const Model = app.sequelize.getModel('Donator')
    try {
      await Model.truncate({transaction})
      await Model.bulkCreate(items, {transaction})
      await transaction.commit()
    }
    catch (exception) {
      await transaction.rollback()
    }

    return items
  }

  async function pushDonatorsToBlockchain (items, params) {

    const sequelize  = app.sequelize
    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    const pending = await blockchain.checkPendingTransactions()
    if (pending > 0) return {success: false, pending}

    const unlockTimeout = _.get(params, 'unlockTimeout', 3000)
    blockchain.unlock(unlockTimeout)
    logger.info('Pushing donators to blockchain...')
    const pushedItems = []
    const promises    = _.map(items, item => {
      if (!item.email) {
        logger.info('Donator "%s" skipped - no email', item.name)
      }
      else {
        const arr    = blockchain.donators.getByEMail(item.email)
        const exists = (arr[2] !== '')
        if (exists) {
          logger.info('Donator %s skipped', item.name || item.email)
        }
        else {
          logger.info('Pushing new donator "%s" with email "%s"...', item.name, item.email)
          const txId = blockchain.donators.add(item.name, item.email, item.contact)
          pushedItems.push(item)
          const tableName = sequelize.getModel('Donator').tableName
          return blockchain.addTransaction(txId, {tableName})
        }
      }
    })
    await Promise.all(promises)

    app.blockchain.lock()

    logger.info('Total pushed donators: %d', pushedItems.length)

    return {success: true, items: pushedItems}
  }

  return {
    getRepository,
    loadFromFile,
    pullDonatorsFromBlockchain,
    pushDonatorsToBlockchain,
  }

}
