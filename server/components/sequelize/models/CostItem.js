/**
 * Module CostItem.js
 *
 * Foundation cost item model
 *  id            integer
 *  name          string(255)
 *  idFoundation  integer
 *  createdAt     datetime
 *  updatedAt     datetime
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const modelName   = 'CostItem'
const tableName   = 'CostItems'
const underscored = false
const timestamps  = true

const options = {
  tableName, underscored, timestamps,

  getterMethods: {
    foundationName () {
      return this.foundation ? this.foundation.name : null
    },
  }
}

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(modelName, {
    idCostItem:   DataTypes.INTEGER(11).UNSIGNED,
    name:         DataTypes.STRING(255),
    idFoundation: DataTypes.INTEGER(11).UNSIGNED,
  }, options)
}
