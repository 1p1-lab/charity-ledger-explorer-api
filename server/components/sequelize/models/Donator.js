/**
 * Module Donator.js
 *
 * Donator model
 *  idDonator       integer
 *  name            string(255)
 *  hashEMail       string(255)
 *  contact         string(255)
 *  isPerson        bool
 *  idMarketplace   integer
 *  createdAt       datetime
 *  updatedAt       datetime
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const keccak256 = require('js-sha3').keccak256

const modelName   = 'Donator'
const tableName   = 'Donators'
const underscored = false
const timestamps  = true

const options = {
  tableName, underscored, timestamps,
}

module.exports = (sequelize, DataTypes) => {
  const Donator = sequelize.define(modelName, {
    idDonator:     {type: DataTypes.INTEGER(11).UNSIGNED, primaryKey: true},
    name:          DataTypes.STRING(255),
    contact:       DataTypes.STRING(255),
    hashEMail:     DataTypes.STRING(255),
    isPerson:      DataTypes.BOOLEAN,
    idMarketplace: DataTypes.INTEGER(11).UNSIGNED,
  }, options)

  Donator.buildQuery = function (params) {
    const DonatorQuery = require('../query')(Donator).extend({

      andWhereIdEqual (id) {
        return this.andWhereAttributeEqual('idDonator', id)
      },

      andWhereNameLike (name) {
        return this.andWhereAttributeBegins('name', name)
      },

      andWhereEmailEqual (email) {
        const hashEMail = (email ? '0x'+keccak256(email) : '')
        return this.andWhereAttributeEqual('hashEMail', hashEMail)
      },

      andWhereIsPerson (flag) {
        return this.andWhereAttributeEqual('isPerson', flag)
      },

      parseRequest (params) {
        return this
          .andWhereIdEqual(params.id)
          .andWhereNameLike(params.name)
          .andWhereEmailEqual(params.email)
          .andWhereIsPerson(params.isPerson)
      }
    })

    return DonatorQuery.fromRequest(params)
  }

  return Donator
}
