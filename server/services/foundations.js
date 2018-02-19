/**
 * Module foundations.js
 * Foundation service
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const _       = require('lodash')
const appRoot = require('app-root-path').path
const path    = require('path')
const moment  = require('moment')

const REPOSITORY_PATH = path.join(appRoot, 'server', 'repositories')

module.exports = (app) => {

  const sequelize = app.sequelize

  const getRepository = () => {
    const repositoryPath = path.join(REPOSITORY_PATH, 'foundations')
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

  async function getFoundationDetails (idFoundation, params) {
    const repository = getRepository()

    const foundation = await repository.findById(idFoundation)
    const dateFrom = _.has(params, 'dateFrom') ? moment.utc(params.dateFrom, 'YYYY.MM.DD').toDate() : false
    const dateTo   = _.has(params, 'dateTo')   ? moment.utc(params.dateTo,   'YYYY.MM.DD').toDate() : false

    if (!foundation)
      return null

    const donationRepository = getDonationRepository()
    const expenseRepository  = getExpenseRepository()

    const donationsTotal               = await donationRepository.getSumByFoundation(idFoundation, {dateFrom, dateTo})
    const expensesTotal                = await expenseRepository.getSumByFoundation(idFoundation, {dateFrom, dateTo})
    const foundationDonationsByTarget  = await donationRepository.getFoundationDonationsByTarget(idFoundation, {dateFrom, dateTo})
    const foundationExpensesByProject  = await expenseRepository.getFoundationExpensesByProject(idFoundation, {dateFrom, dateTo})
    const foundationExpensesByPrograms = await expenseRepository.getFoundationExpensesByPrograms(idFoundation, {dateFrom, dateTo})

    return {
      foundation,
      donationsTotal,
      expensesTotal,
      donations: {
        targets: foundationDonationsByTarget,
      },
      expenses:  {
        projects: foundationExpensesByProject,
        programs: foundationExpensesByPrograms
      },
    }
  }

  return {
    getFoundationDetails,
    getRepository,
  }

}
