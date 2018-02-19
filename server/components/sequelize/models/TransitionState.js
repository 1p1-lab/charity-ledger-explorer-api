/**
 * Module TransitionState.js
 *
 * TransitionState model
 *  id            integer
 *  txId          string(100) Transition ID
 *  txState       integer     State (1-pending, 2-succeeded, 3-failed)
 *  idFoundation  integer     Foundation ID
 *  tableName     string(50) Table name
 *  idRow         integer     Table record ID (idProgram, idProject, idTarget, etc)
 *  createdAt     datetime
 *  updatedAt     datetime
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const modelName   = 'TransitionState'
const tableName   = 'TransitionStates'
const underscored = false
const timestamps  = true

const options = {
  tableName, underscored, timestamps,

  getterMethods: {
    foundationName () {
      return this.foundation ? this.foundation.name : null
    },
    pending () {
      return this.txState == 1
    },
    succeeded () {
      return this.txState == 2
    },
    failed () {
      return this.txState == 3
    },
  }
}

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(modelName, {
    txId:         DataTypes.STRING(100),
    txState:      DataTypes.INTEGER(1),
    idFoundation: DataTypes.INTEGER(11).UNSIGNED,
    tableName:    DataTypes.STRING(100),
    idRow:        DataTypes.INTEGER(11).UNSIGNED,
  }, options)
}
