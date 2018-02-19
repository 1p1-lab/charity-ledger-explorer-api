/**
 * Module DonationSource.js
 *
 * Foundation donation sources model
 *  idSource      integer
 *  name          string(255)
 *  isDoubleEntry bool
 *  createdAt     datetime
 *  updatedAt     datetime
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const modelName   = 'DonationSource'
const tableName   = 'DonationSources'
const underscored = false
const timestamps  = true
const options     = {
  tableName, underscored, timestamps,
}

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(modelName, {
    idSource:      {type: DataTypes.INTEGER(11).UNSIGNED, primaryKey: true},
    name:          DataTypes.STRING(255),
    isDoubleEntry: DataTypes.BOOLEAN,
  }, options)
}
