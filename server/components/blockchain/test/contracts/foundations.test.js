/**
 * Module foundations.test.js
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

describe('Foundation', function () {

  it('test model', async function () {

    expect(config).to.have.property('contractPath')
    expect(config).to.have.property('contracts')
    expect(config.contracts).to.have.property('Foundation')
    expect(config.contracts.Foundation).to.have.property('abi')
    expect(config.contracts.Foundation).to.have.property('address')

    const contractPath = _.get(config, 'contractPath')
    const abiFile      = _.get(config, 'contracts.Foundation.abi')
    const address      = _.get(config, 'contracts.Foundation.address')

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

    let foundation = null
    expect(function () {
      const Model = require('../../contracts/Foundation')
      foundation  = Model(contract)
    }).to.not.be.throw()

    expect(foundation).to.have.property('getByList')
    expect(foundation).to.have.property('getByID')
    expect(foundation).to.have.property('itemCount')
    expect(foundation).to.have.property('getIDByAddress')
    expect(foundation).to.have.property('add')
    expect(foundation).to.have.property('set')
    expect(foundation).to.have.property('filterEvents')

    const f1 = await foundation.getByID(1)
    expect(f1).to.be.an('array')
    expect(f1).to.include('Charity Blockchain Association')

    async function filterEvents () {
      return foundation.filterEvents()
    }
    await filterEvents()
  })

})
