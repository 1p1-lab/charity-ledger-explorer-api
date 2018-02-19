/**
 * Module program.test.js
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.2.0
 */

const expect = require('chai').expect
const _      = require('lodash')
const Web3   = require('../web3')
const config = require('../../config')

const context = {
  get(key, def) {
    return _.get(this, key, def)
  },
  set(key, value) {
    _.set(this, key, value)
  },
}

describe('Program', function () {

  it('test model', async function () {

    expect(config).to.have.property('contractPath')
    expect(config).to.have.property('contracts')
    expect(config.contracts).to.have.property('Program')
    expect(config.contracts.Program).to.have.property('abi')
    expect(config.contracts.Program).to.have.property('address')

    const contractPath = _.get(config, 'contractPath')
    const abiFile      = _.get(config, 'contracts.Program.abi')
    const address      = _.get(config, 'contracts.Program.address')

    let abi = null
    expect(function () {
      abi = require(contractPath + abiFile).abi
    }).to.not.be.throw()
    expect(address).to.be.an('string')
    expect(abi).to.be.an('array')

    let web3 = null
    expect(function () {
      web3 = Web3(config)
    }).to.not.be.throw()

    let contract = null
    expect(function () {
      contract = web3.eth.contract(abi).at(address)
    }).to.not.be.throw()

    let program = null
    expect(function () {
      const Model = require('../../contracts/Program')
      program  = Model(contract)
    }).to.not.be.throw()

    expect(program).to.have.property('getByList')
    expect(program).to.have.property('getByID')
    expect(program).to.have.property('getCountByCharityFoundation')
    expect(program).to.have.property('add')
    expect(program).to.have.property('set')
  })

})
