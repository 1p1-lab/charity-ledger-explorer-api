/**
 * Module ExpenseView.js
 *
 * Foundation expenses view model
 *  id              integer
 *  idExpense       integer
 *  idCostItem      integer
 *  costItemName    string(255)
 *  sum             float
 *  idFoundation    integer
 *  nameFoundation  string(255)
 *  idTarget        integer
 *  nameTarget      string(255)
 *  idProject       integer
 *  nameProject     string(255)
 *  idProgram       integer
 *  nameProgram     string(255)
 *  nDoc            string(32)
 *  dDoc            datetime
 *  remark          string(255)
 *  txId            string(100)
 *  createdAt       datetime
 *  updatedAt       datetime
 *
 * @author  Alex G. <alexg@oneplus1.ru>
 * @since   0.1.0
 */

const modelName   = 'ExpenseView'
const tableName   = 'ExpensesView'
const underscored = false
const timestamps  = false

const options = {
  tableName, underscored, timestamps,
}

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(modelName, {
    idExpense:      DataTypes.INTEGER(11).UNSIGNED,
    sum:            DataTypes.DECIMAL(10, 2),
    idCostItem:     DataTypes.INTEGER(11).UNSIGNED,
    costItemName:   DataTypes.STRING(255),
    idFoundation:   DataTypes.INTEGER(11).UNSIGNED,
    nameFoundation: DataTypes.STRING(255),
    idProject:      DataTypes.INTEGER(11).UNSIGNED,
    nameProject:    DataTypes.STRING(255),
    idProgram:      DataTypes.INTEGER(11).UNSIGNED,
    nameProgram:    DataTypes.STRING(255),
    nDoc:           DataTypes.STRING(32),
    dDoc:           DataTypes.DATE,
    remark:         DataTypes.STRING(255),
    txId:           DataTypes.STRING(100),
  }, options)
}
