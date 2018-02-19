/**
 * Module Program.js
 *
 * Foundation program model
 *  id              integer
 *  idProgram       integer
 *  name            string(255)
 *  idFoundation    integer
 *  idMarketplace   integer
 *  createdAt       datetime
 *  updatedAt       datetime
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const modelName   = 'Program'
const tableName   = 'CharityPrograms'
const underscored = false
const timestamps  = true

const options = {
  tableName, underscored, timestamps,

  getterMethods: {
    nameFoundation () {
      return this.foundation ? this.foundation.name : undefined
    },
  }
}

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(modelName, {
    idProgram:     DataTypes.INTEGER(11).UNSIGNED,
    name:          DataTypes.STRING(255),
    idFoundation:  DataTypes.INTEGER(11).UNSIGNED,
    idMarketplace: DataTypes.INTEGER(11).UNSIGNED,
    website:       DataTypes.STRING(255),
  }, options)

}
