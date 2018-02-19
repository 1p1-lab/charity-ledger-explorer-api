/**
 * Module Donation.js
 *
 * Foundation donation model
 *  id            integer
 *  idDonation    integer
 *  idDonator     integer
 *  nameDonator   string(255)
 *  idSource      integer
 *  sum           float
 *  idFoundation  integer
 *  idTarget      integer
 *  nDoc          string(32)
 *  dDoc          datetime
 *  remark        string(255)
 *  txId          string(100)
 *  createdAt     datetime
 *  updatedAt     datetime
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const _         = require('lodash')
const keccak256 = require('js-sha3').keccak256

const modelName   = 'Donation'
const tableName   = 'Donations'
const underscored = false
const timestamps  = true

const options = {
  tableName, underscored, timestamps,

  getterMethods: {
    sourceName () {
      return this.source ? this.source.name : null
    },

    targetName () {
      return this.target ? this.target.name : null
    },

    foundationName () {
      return this.foundation ? this.foundation.name : null
    },

    donatorHash () {
      return this.donator ? this.donator.hashEMail : null
    },

    donatorIsPerson () {
      return this.donator ? this.donator.isPerson : null
    },

  }
}

module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define(modelName, {
    idDonation:   DataTypes.INTEGER(11).UNSIGNED,
    idDonator:    DataTypes.INTEGER(11).UNSIGNED,
    nameDonator:  DataTypes.STRING(255),
    idSource:     DataTypes.INTEGER(11).UNSIGNED,
    sum:          DataTypes.DECIMAL(10, 2),
    idFoundation: DataTypes.INTEGER(11).UNSIGNED,
    idTarget:     DataTypes.INTEGER(11).UNSIGNED,
    nDoc:         DataTypes.STRING(32),
    dDoc:         DataTypes.DATE,
    remark:       DataTypes.STRING(255),
    txId:         DataTypes.STRING(100),
  }, options)

  Donation.buildQuery = function (params) {
    const DonationQuery = require('../query')(Donation).extend({

      andWhereIdEqual (id) {
        return this.andWhereAttributeEqual('idDonation', id)
      },

      andWhereSumEqual (sum) {
        return this.andWhereAttributeEqual('sum', sum)
      },

      andWhereDonatorEqual (id) {
        return this.andWhereAttributeEqual('idDonator', id)
      },

      andWhereDonatorNameLike (name) {
        return this.andWhereAttributeBegins('donatorName', name)
      },

      andWhereDonatorEmailEqual (email) {
        const hashEMail = (email ? '0x'+keccak256(email) : '')
        return this.andWhereAttributeEqual('$donator.hashEMail$', hashEMail)
      },

      andWhereSourceEqual (id) {
        return this.andWhereAttributeEqual('idSource', id)
      },

      andWhereSourceNameLike (name) {
        return this.andWhereAttributeBegins('$source.name$', name)
      },

      andWhereFoundationEqual (id) {
        return this.andWhereAttributeEqual('idFoundation', id)
      },

      andWhereFoundationNameLike (name) {
        return this.andWhereAttributeBegins('$foundation.name$', name)
      },

      andWhereProjectEqual (id) {
        return this.andWhereAttributeEqual('idProject', id)
      },

      andWhereProgramEqual (id) {
        return this.andWhereAttributeEqual('idProgram', id)
      },

      andWhereTargetEqual (id) {
        return this.andWhereAttributeEqual('idTarget', id)
      },

      andWhereTargetNameLike (name) {
        return this.andWhereAttributeBegins('$target.name$', name)
      },

      andWhereCreatedBefore (date) {
        if (date) {
          this.andWhereAttributeLess('dDoc', new Date(date))
        }
        return this
      },

      andWhereCreatedAfter (date) {
        if (date) {
          return this.andWhereAttributeGreater('dDoc', new Date(date))
        }
        return this
      },

      afterFindAll (results) {
        return this.sum('sum')
          .then(totalSum => {
            return _.extend(results, {totalSum})
          })
          .catch(exception => {
            console.log(exception)
          })
      },

      parseRequest (params) {
        return this
          .addLink('Donator', 'donator')
          .addLink('DonationSource', 'source')
          .addLink('Foundation', 'foundation')
          .addLink('Target', 'target')
          .andWhereIdEqual(params.id)
          .andWhereSumEqual(params.sum)
          .andWhereDonatorEqual(params.idDonator)
          .andWhereDonatorNameLike(params.nameDonator)
          .andWhereDonatorEmailEqual(params.donatorEmail)
          .andWhereSourceEqual(params.idSource)
          .andWhereSourceNameLike(params.sourceName)
          .andWhereFoundationEqual(params.idFoundation)
          .andWhereFoundationNameLike(params.foundationName)
          .andWhereProjectEqual(params.idProject)
          .andWhereProgramEqual(params.idProgram)
          .andWhereTargetEqual(params.idTarget)
          .andWhereTargetNameLike(params.targetName)
          .andWhereCreatedAfter(params.minDate)
          .andWhereCreatedBefore(params.maxDate)
      }
    })

    return DonationQuery.fromRequest(params)
  }

  return Donation
}
