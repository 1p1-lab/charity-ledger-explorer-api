/**
 * Module setup-models.js
 *
 * Setup component models
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const path    = require('path')
const appRoot = require('app-root-path').path

module.exports = (sequelize, options) => {

  const importModel = (modelName) => {
    const modelPath = path.resolve(appRoot, options.modelsPath, modelName + '.js')
    return sequelize.import(modelPath)
  }

  const defineModels = () => {
    const Foundation      = importModel('Foundation')
    const Project         = importModel('Project')
    const Program         = importModel('Program')
    const Target          = importModel('Target')
    const Donator         = importModel('Donator')
    const DonationSource  = importModel('DonationSource')
    const Donation        = importModel('Donation')
    const DonationView    = importModel('DonationView')
    const ExpenseView     = importModel('ExpenseView')
    const CostItem        = importModel('CostItem')
    const Expense         = importModel('Expense')
    const TransitionState = importModel('TransitionState')

    Project.belongsTo(Foundation, {foreignKey: 'idFoundation', targetKey: 'idFoundation', as: 'foundation'})

    Program.belongsTo(Foundation, {foreignKey: 'idFoundation', targetKey: 'idFoundation', as: 'foundation'})

    Target.belongsTo(Foundation, {foreignKey: 'idFoundation', targetKey: 'idFoundation', as: 'foundation'})
    Target.belongsTo(Project, {foreignKey: 'idProject', targetKey: 'idProject', as: 'project'})
    Target.belongsTo(Program, {foreignKey: 'idProgram', targetKey: 'idProgram', as: 'program'})

    Donation.belongsTo(Donator, {foreignKey: 'idDonator', targetKey: 'idDonator', as: 'donator'})
    Donation.belongsTo(DonationSource, {foreignKey: 'idSource', targetKey: 'idSource', as: 'source'})
    Donation.belongsTo(Foundation, {foreignKey: 'idFoundation', targetKey: 'idFoundation', as: 'foundation'})
    Donation.belongsTo(Target, {foreignKey: 'idTarget', targetKey: 'idTarget', as: 'target'})

    CostItem.belongsTo(Foundation, {foreignKey: 'idFoundation', targetKey: 'idFoundation', as: 'foundation'})

    Expense.belongsTo(CostItem, {foreignKey: 'idCostItem', targetKey: 'idCostItem', as: 'costItem'})
    Expense.belongsTo(Foundation, {foreignKey: 'idFoundation', targetKey: 'idFoundation', as: 'foundation'})
    Expense.belongsTo(Project, {foreignKey: 'idProject', targetKey: 'idProject', as: 'project'})
    Expense.belongsTo(Program, {foreignKey: 'idProgram', targetKey: 'idProgram', as: 'program'})

    TransitionState.belongsTo(Foundation, {foreignKey: 'idFoundation', targetKey: 'idFoundation', as: 'foundation'})

    return sequelize
  }

  return defineModels()
}