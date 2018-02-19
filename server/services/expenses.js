/**
 * Module expenses.js
 * Foundation expenses service
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const _          = require('lodash')
const appRoot    = require('app-root-path').path
const path       = require('path')
const moment     = require('moment')
const BigNumber  = require('bignumber.js')
const validator  = require('../helpers/validators')
const dateHelper = require('../helpers/date-helpers')

const REPOSITORY_PATH = path.join(appRoot, 'server', 'repositories')

module.exports = (app) => {

  const sequelize = app.sequelize
  const i18n      = app.i18n

  const getRepository = () => {
    const repositoryPath = path.join(REPOSITORY_PATH, 'expenses')
    const repository     = require(repositoryPath)
    return repository(sequelize)
  }

  async function loadFromFile (filePath, params) {

    const handlers = {
      validate:  validateExpense,
      transform: transformExpense,
    }

    return await app.services.parse.parse(filePath, _.extend(handlers, params))
  }

  // Validate expense while parsing CSV file
  const validateExpense = (data) => {

    const dDoc       = data['DDOC']
    const nDoc       = data['NDOC']
    const idCostItem = data['idCOSTITEM']
    const idProgram  = data['idPROGRAM']
    const idProject  = data['idPROJECT']
    const remark     = data['REMARK']
    const sum        = data['SUMMA']

    const remarkMaxLength = 255
    const nDocMaxLength   = 32

    if (validator.isEmpty(idProgram) && validator.isEmpty(idProject)) {
      return {field: 'idPROGRAM', error: 'required'}
    }
    if (idProgram && !validator.isId(idProgram)) {
      return {field: 'idPROJECT', error: 'invalid_id', type: 'numeric'}
    }
    if (idProject && !validator.isId(idProject)) {
      return {field: 'idPROJECT', error: 'invalid_id', type: 'numeric'}
    }

    if (validator.isEmpty(idCostItem)) {
      return {field: 'idCOSTITEM', error: 'required'}
    }
    if (!validator.isId(idCostItem)) {
      return {field: 'idCOSTITEM', error: 'invalid_id', type: 'numeric'}
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

  // Transform expense data to model
  const transformExpense = (data) => {
    const dDoc       = data['DDOC']
    const nDoc       = data['NDOC'] || ''
    const idCostItem = data['idCOSTITEM']
    const idProgram  = data['idPROGRAM']
    const idProject  = data['idPROJECT']
    const remark     = data['REMARK'] || ''
    const sum        = parseFloat(data['SUMMA'])

    if (!sum) {
      throw new Error('Invalid sum - ' + data['SUMMA'])
    }

    return {dDoc, nDoc, idCostItem, idProgram, idProject, remark, sum}
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

  const checkProgram = (idProgram, idFoundation) => {
    if (!idProgram) {
      throw new Error(i18n.__('Программа не указана'))
    }

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

  const checkProject = (idProject, idFoundation) => {
    if (!idProject) {
      throw new Error(i18n.__('Проект не указан'))
    }

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

  const checkCostItem = (idCostItem, idFoundation) => {
    if (!idCostItem) {
      throw new Error(i18n.__('Статья расходов не указана'))
    }

    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    // Check if cost item exists
    const source = app.blockchain.costItems.getByID(idFoundation, idCostItem)
    if (source[2] === '') {
      logger.error('Cost item #%s not found', idCostItem)
      throw new Error(i18n.__('Статья расходов %s не найдена в фонде %s', idCostItem, idFoundation))
    }
  }

  /**
   * Pull expenses from blockchain
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
  async function pullExpensesFromBlockchain (idFoundation, date, params) {

    checkFoundation(idFoundation)

    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    const force = _.get(params, 'force', false)

    blockchain.connect()

    const dDoc = new Date(date)

    logger.info('Pulling expenses for %s (foundation #%s)... ', moment(date).format('YYYY-MM-DD'), idFoundation)
    const yyyymmdd = dateHelper.date2yyyymmdd(dDoc)
    const events   = await app.blockchain.getExpenseEvents(idFoundation, yyyymmdd)
    // if (events === null) {
    //   logger.warn('Attempting to fetch donation events again...')
    //   return pullExpensesFromBlockchain(idFoundation, date, params)
    // }

    const arr      = app.blockchain.expenses.getAllByDDOC(idFoundation, yyyymmdd)
    let items      = _.map(arr, d => {
      const idExpense    = d[1].toString(10)
      const idFoundation = d[2].toString(10)
      const yyyymmdd     = d[3].toString(10)
      const nDoc         = d[4] || ''
      const idProgram    = d[5].toString(10)
      const idProject    = d[6].toString(10)
      const idCostItem   = d[7].toString(10)
      const remark       = d[8] || ''
      const sum          = d[9].div(100).toString(10)

      const txId = _.get(_.findLast(events, {idExpense}), 'txId', null)

      const expense = {
        idExpense,
        idCostItem,
        sum,
        idFoundation,
        idProject,
        idProgram,
        nDoc,
        dDoc,
        remark,
        txId,
      }
      logger.info('%j', expense)
      return expense
    })

    logger.info('Found expenses: %d', items.length)

    const transaction = await app.sequelize.transaction()

    const Model = app.sequelize.getModel('Expense')
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
          const idExpense = item.idExpense
          const where     = {idExpense, idFoundation}
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
      logger.info('Inserted expenses: %d', items.length)
      await transaction.commit()
    }
    catch (exception) {
      logger.error('%s', exception.message)
      await transaction.rollback()
    }

    return items
  }

  /**
   * Push expenses to blockchain
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
  async function pushExpensesToBlockchain (idFoundation, items, params) {

    const sequelize  = app.sequelize
    const blockchain = app.blockchain
    const logger     = app.getLogger('blockchain')

    blockchain.connect()

    checkFoundation(idFoundation)

    const pending = await blockchain.checkPendingTransactions({idFoundation})
    if (pending > 0) return {success: false, pending}

    const unlockTimeout = _.get(params, 'unlockTimeout', 3000)
    blockchain.unlock(unlockTimeout)

    logger.info('Pushing expenses to blockchain (foundation ID=%s)...', idFoundation)

    const pushedItems    = []
    const tableName      = sequelize.getModel('Expense').tableName
    const addNewExpenses = (expenses, dDoc) => {
      const yyyymmdd = dateHelper.date2yyyymmdd(dDoc)
      logger.info('%s', yyyymmdd)
      const arr = blockchain.expenses.getListIDByYYYYMMDD(idFoundation, yyyymmdd)
      if (arr.length > 0) return []
      return _.map(expenses, expense => {
        if (expense.idProgram) {
          checkProgram(expense.idProgram, idFoundation)
        }
        if (expense.idProject) {
          checkProject(expense.idProject, idFoundation)
        }
        checkCostItem(expense.idCostItem, idFoundation)

        if (expense.idProgram)
          logger.info('Pushing new expense at program #%s (sum=%s)...', expense.idProgram, expense.sum)
        else
          logger.info('Pushing new expense at project #%s (sum=%s)...', expense.idProject, expense.sum)

        const sum100 = (new BigNumber(expense.sum)).mul(100, 10).toString(10)
        const txId   = blockchain.expenses.add(idFoundation, yyyymmdd, expense.nDoc,
          expense.idProgram, expense.idProject, expense.idCostItem,
          expense.remark, sum100)
        pushedItems.push(expense)

        return blockchain.addTransaction(txId, {idFoundation, tableName})
      })
    }

    const promises = _.chain(items)
      .groupBy('dDoc')
      .flatMap(addNewExpenses)
      .value()

    await Promise.all(promises)

    app.blockchain.lock()

    logger.info('Total pushed expenses: %d', pushedItems.length)

    return {success: true, items: pushedItems}
  }

  return {
    getRepository,
    loadFromFile,
    pullExpensesFromBlockchain,
    pushExpensesToBlockchain,
  }

}
