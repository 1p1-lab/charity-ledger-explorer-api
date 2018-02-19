/**
 * Module index.js
 *
 * Initialize blockchain component
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const Web3 = require('web3')
const _    = require('lodash')

module.exports = (app, options) => {

  const provider = options.provider
  const host     = process.env.PROVIDER_HOST || provider.host
  const timeout  = process.env.PROVIDER_TIMEOUT || provider.timeout
  const user     = process.env.PROVIDER_USER || provider.user
  const password = process.env.PROVIDER_PASSWORD || provider.password
  const gas      = process.env.DEFAULT_GAS || provider.gas
  const account  = {address: process.env.ACCOUNT_ADDRESS, password: process.env.ACCOUNT_PASSWORD}

  const charityFoundations = require('./models/charityFoundations')
  const charityPrograms    = require('./models/charityPrograms')
  const charityProjects    = require('./models/charityProjects')
  const charityTargets     = require('./models/charityTargets')
  const costItems          = require('./models/costItems')
  const donationSources    = require('./models/donationSources')
  const donators           = require('./models/Donators')
  const donations          = require('./models/Donations')
  const expenses           = require('./models/Expenses')
  const keyValueStorage    = require('./models/keyValueStorage')

  let web3 = null

  const logger = app.loggers.blockchain

  app['blockchain'] = {
    version:   null,
    node:      null,
    network:   null,
    connected: null,

    foundations:     null,
    programs:        null,
    projects:        null,
    targets:         null,
    costItems:       null,
    donationSources: null,
    donators:        null,
    donations:       null,
    expenses:        null,
    keyValueStorage: null,

    connect () {
      if (web3) return this

      logger.info('Connecting to blockchain (%s)...', host)
      web3 = new Web3(new Web3.providers.HttpProvider(host))

      this.version   = web3.version.api
      this.node      = web3.version.node
      this.network   = web3.version.network
      this.connected = web3.isConnected()

      logger.info('Network: %s', this.network)
      logger.info('Node:    %s', this.node)
      logger.info('Version: %s', this.version)

      this.foundations     = new charityFoundations.charityFoundations(web3)
      this.programs        = new charityPrograms.charityPrograms(web3)
      this.projects        = new charityProjects.charityProjects(web3)
      this.targets         = new charityTargets.charityTargets(web3)
      this.costItems       = new costItems.costItems(web3)
      this.donationSources = new donationSources.donationSources(web3)
      this.donators        = new donators.Donators(web3)
      this.donations       = new donations.Donations(web3)
      this.expenses        = new expenses.Expenses(web3)
      this.keyValueStorage = new keyValueStorage.keyValueStorage(web3)

      return this
    },

    unlock (t) {
      return this.unlockAccount(account.address, account.password, t)
    },

    unlockAccount (address, password, t) {
      this.connect()
      const tm = parseInt(t || timeout)
      logger.info('Unlocking account (%d ms)...', 1000 * tm)
      if (!this.isDevelopment()) {
        web3.personal.unlockAccount(address, password, tm)
      }
      logger.info('Account %s unlocked', address)
      return this
    },

    lock () {
      return this.lockAccount(account.address)
    },

    lockAccount (address) {
      this.connect()
      logger.info('Locking account...')
      if (!this.isDevelopment()) {
        web3.personal.lockAccount(address)
      }
      logger.info('Account %s locked', address)
      return this
    },

    isDevelopment () {
      return this.network > 3000
    },

    async addTransaction (txId, data) {
      const Model = app.sequelize.getModel('TransitionState')
      const where = {txId}
      const tx    = await Model.findOne({where})
      if (!tx) {
        return Model.create(_.extend({}, data, {txId}))
      }
      return tx
    },

    async updateTransactionStatus (txId) {
      const Model = app.sequelize.getModel('TransitionState')
      const where = {txId}

      this.connect()
      const sent = web3.eth.getTransaction(txId)
      if (sent) {
        const recp = web3.eth.getTransactionReceipt(txId)
        if (recp) {
          const txState = (recp.status === '0x1' ? 2 : 3)
          return Model.update({txState}, {where})
        }
      }
    },

    /**
     *
     * @param where {Object}
     *
     * @returns {Promise.<Integer>}
     */
    async checkPendingTransactions (where) {
      const Model = app.sequelize.getModel('TransitionState')

      const txState = 1
      where         = _.extend({}, where, {txState})

      // Find all pending transactions
      const result = await Model.findAndCountAll({where})
      if (result.count === 0) return 0

      logger.info('Found pending transactions: %d', result.count)
      const promises = _.map(result.rows, tr => {
        // check and update status
        return this.updateTransactionStatus(tr.txId)
      })

      await Promise.all(promises)

      // Check again
      return await Model.count({where})
    },

    async getDonationEvents (idCharityFoundation, yyyymmdd) {
      return new Promise((resolve, reject) => {

        const callback = function (error, logs) {
          if (error) {
            logger.error(error)
            resolve(null)
            return
          }
          const events = _.chain(logs)
            .map(item => {
              const txId       = item.transactionHash
              const idDonation = item.args.ID.toString(10)
              const yyyymmdd   = item.args.yyyymmdd.toString(10)
              return {idDonation, txId, yyyymmdd}
            })
            .filter({yyyymmdd})
            .value()
          return resolve(events)
        }

        const filter = this.donations.smartContract.Add({idCharityFoundation}, {fromBlock: 0, toBlock: 'latest'})
        filter.get(callback)
      })
    },

    async getExpenseEvents (idCharityFoundation, yyyymmdd) {
      return new Promise((resolve, reject) => {

        const callback = function (error, logs) {
          if (error) {
            logger.error(error)
            resolve(null)
            return
          }
          const events = _.chain(logs)
            .map(item => {
              const txId      = item.transactionHash
              const idExpense = item.args.ID.toString(10)
              const yyyymmdd  = item.args.yyyymmdd.toString(10)
              return {idExpense, txId, yyyymmdd}
            })
            .filter({yyyymmdd})
            .value()
          return resolve(events)
        }

        const filter = this.expenses.smartContract.Add({idCharityFoundation}, {fromBlock: 0, toBlock: 'latest'})
        filter.get(callback)
      })
    }
  }
}
