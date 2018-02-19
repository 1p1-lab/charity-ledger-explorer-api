/**
 * Module Expense.js
 *
 * Foundation expense model:
 *  id            integer
 *  idExpense     integer
 *  idCostItem    integer
 *  sum           float
 *  idFoundation  integer
 *  idTarget      integer
 *  nDoc          string(32)
 *  dDoc          datetime
 *  remark        string(255)
 *  createdAt     datetime
 *  updatedAt     datetime
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const _ = require('lodash')

const modelName   = 'Expense'
const tableName   = 'Expenses'
const underscored = false
const timestamps  = true

const options = {
  tableName, underscored, timestamps,

  getterMethods: {
    costItemName () {
      return this.costItem ? this.costItem.name : null
    },

    foundationName () {
      return this.foundation ? this.foundation.name : null
    },

    programName () {
      return this.program ? this.program.name : null
    },

    projectName () {
      return this.project ? this.project.name : null
    },

  }
}

module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define(modelName, {
    idExpense:    DataTypes.INTEGER(11).UNSIGNED,
    idCostItem:   DataTypes.INTEGER(11).UNSIGNED,
    sum:          DataTypes.DECIMAL(10, 2),
    idFoundation: DataTypes.INTEGER(11).UNSIGNED,
    idProject:    DataTypes.INTEGER(11).UNSIGNED,
    idProgram:    DataTypes.INTEGER(11).UNSIGNED,
    nDoc:         DataTypes.STRING(32),
    dDoc:         DataTypes.DATE,
    remark:       DataTypes.STRING(255),
    txId:         DataTypes.STRING(100),
  }, options)

  Expense.buildQuery = function (params) {
    const ExpenseQuery = require('../query')(Expense).extend({

      andWhereIdEqual (id) {
        return this.andWhereAttributeEqual('idExpense', id)
      },

      andWhereSumEqual (sum) {
        return this.andWhereAttributeEqual('sum', sum)
      },

      andWhereCostItemEqual (id) {
        return this.andWhereAttributeEqual('idCostItem', id)
      },

      andWhereCostNameLike (name) {
        return this.andWhereAttributeBegins('$cost.name$', name)
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

      andWhereProjectNameLike (name) {
        return this.andWhereAttributeBegins('$project.name$', name)
      },

      andWhereProgramEqual (id) {
        return this.andWhereAttributeEqual('idProgram', id)
      },

      andWhereProgramNameLike (name) {
        return this.andWhereAttributeBegins('$program.name$', name)
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
      },

      parseRequest (params) {
        return this
          .addLink('CostItem', 'costItem')
          .addLink('Foundation', 'foundation')
          .addLink('Project', 'project')
          .addLink('Program', 'program')
          .andWhereIdEqual(params.id)
          .andWhereSumEqual(params.sum)
          .andWhereCostItemEqual(params.idCostItem)
          .andWhereCostNameLike(params.costName)
          .andWhereFoundationEqual(params.idFoundation)
          .andWhereFoundationNameLike(params.foundationName)
          .andWhereProjectEqual(params.idProject)
          .andWhereProjectNameLike(params.projectName)
          .andWhereProgramEqual(params.idProgram)
          .andWhereProgramNameLike(params.programName)
          .andWhereCreatedAfter(params.minDate)
          .andWhereCreatedBefore(params.maxDate)
      }
    })

    return ExpenseQuery.fromRequest(params)
  }

  Expense.prototype.populate = function () {
    return {
      idExpense:      this.idExpense,
      sum:            this.sum,
      idCostItem:     this.idCostItem,
      costItemName:   this.costItemName,
      idFoundation:   this.idFoundation,
      foundationName: this.foundationName,
      idProject:      this.idProject,
      projectName:    this.projectName,
      idProgram:      this.idProgram,
      programName:    this.programName,
      nDoc:           this.nDoc,
      dDoc:           this.dDoc,
      remark:         this.remark,
    }
  }

  return Expense
}
