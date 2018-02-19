/**
 * Module Target.js
 *
 * Foundation target model
 *  id              integer
 *  idTarget        integer
 *  name            string(255)
 *  idFoundation    integer
 *  idProject       integer
 *  idProgram       integer
 *  idMarketplace   integer
 *  createdAt       datetime
 *  updatedAt       datetime
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const modelName   = 'Target'
const tableName   = 'CharityTargets'
const underscored = false
const timestamps  = true
const options     = {
  tableName, underscored, timestamps,

  getterMethods: {
    nameFoundation () {
      return this.foundation ? this.foundation.name : (void 0)
    },
    nameProject () {
      return this.project ? this.project.name : (void 0)
    },
    nameProgram () {
      return this.program ? this.program.name : (void 0)
    },
    isPerson () {
      return this.project ? this.project.isPerson : (void 0)
    },
  }
}

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(modelName, {
    idTarget:      DataTypes.INTEGER(11).UNSIGNED,
    name:          DataTypes.STRING(255),
    idFoundation:  DataTypes.INTEGER(11).UNSIGNED,
    idProject:     DataTypes.INTEGER(11).UNSIGNED,
    idProgram:     DataTypes.INTEGER(11).UNSIGNED,
    idMarketplace: DataTypes.INTEGER(11).UNSIGNED,
    website:       DataTypes.STRING(255),
  }, options)
}
