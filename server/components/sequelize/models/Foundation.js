/**
 * Module Foundation.js
 *
 * Foundation model
 *  idFoundation    integer
 *  name            string(255)
 *  address         string(255)
 *  idMarketplace   integer
 *  createdAt       datetime
 *  updatedAt       datetime
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */
const _ = require('lodash')

const modelName   = 'Foundation'
const tableName   = 'CharityFoundations'
const underscored = false
const timestamps  = true

const options = {
  tableName, underscored, timestamps,
}

module.exports = (sequelize, DataTypes) => {
  const Foundation = sequelize.define(modelName, {
    idFoundation:  {type: DataTypes.INTEGER(11).UNSIGNED, primaryKey: true},
    name:          DataTypes.STRING(255),
    address:       DataTypes.STRING(42),
    idMarketplace: DataTypes.INTEGER(11).UNSIGNED,
    website:       DataTypes.STRING(255),
  }, options)

  Foundation.buildQuery = function (params) {
    const FoundationQuery = require('../query')(Foundation).extend({

      andWhereIdEqual (id) {
        return this.andWhereAttributeEqual('idFoundation', id)
      },

      andWhereNameLike (name) {
        return this.andWhereAttributeBegins('name', name)
      },

      andWhereAddressEqual (address) {
        return this.andWhereAttributeEqual('address', address)
      },

      parseRequest (params) {
        return this
          .andWhereIdEqual(params.idFoundation)
          .andWhereNameLike(params.name)
          .andWhereAddressEqual(params.address)
      }
    })

    return FoundationQuery.fromRequest(params)
  }

  return Foundation
}
