/**
 * Module web3.js
 * Setup web3 for tests
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   1.0
 */

const Web3 = require('web3')
const _    = require('lodash')

module.exports = function (config) {

  const host     = _.get(config, 'host')
  const timeout  = 99999
  const user     = _.get(config, 'user')
  const password = _.get(config, 'password')

  const provider = new Web3.providers.HttpProvider(host, timeout, user, password)
  const web3     = new Web3(provider)

  web3.eth.defaultAccount = web3.eth.coinbase

  return web3
}
