/**
 * Module Project.js
 *
 * Foundation project model
 *  id              integer
 *  idProject       integer
 *  name            string(255)
 *  idFoundation    integer
 *  isPerson        bool
 *  idMarketplace   integer
 *  createdAt       datetime
 *  updatedAt       datetime
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const modelName   = 'Project'
const tableName   = 'CharityProjects'
const underscored = false
const timestamps  = true
const options     = {
  tableName, underscored, timestamps,

  getterMethods: {
    nameFoundation () {
      return this.foundation ? this.foundation.name : (void 0)
    },
  }
}

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(modelName, {
    idProject:     DataTypes.INTEGER(11).UNSIGNED,
    name:          DataTypes.STRING(255),
    idFoundation:  DataTypes.INTEGER(11).UNSIGNED,
    isPerson:      DataTypes.BOOLEAN,
    idMarketplace: DataTypes.INTEGER(11).UNSIGNED,
    website:       DataTypes.STRING(255),
  }, options)
}
