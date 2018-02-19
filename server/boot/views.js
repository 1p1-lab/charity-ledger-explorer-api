/**
 * Module views.js
 * Initialize database views
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const foundationsTable = 'CharityFoundations'
const projectsTable    = 'CharityProjects'
const programsTable    = 'CharityPrograms'
const targetsTable     = 'CharityTargets'
const donatorsTable    = 'Donators'
const sourcesTable     = 'DonationSources'
const donationsTable   = 'Donations'
const expensesTable    = 'Expenses'
const costItemsTable   = 'costItems'

const donationsView = 'DonationsView'
const expensesView  = 'ExpensesView'

const donationsViewSelect = 'CREATE VIEW IF NOT EXISTS ' + donationsView + ' AS SELECT ' +
  'dnt.id, ' +
  'dnt.idDonation, ' +
  'dnt.sum, ' +
  'dnt.idDonator, ' +
  'dnt.nameDonator, ' +
  'dtr.hashEMail AS hashDonator, ' +
  'dtr.isPerson, ' +
  'dnt.idFoundation, ' +
  'fnd.name AS nameFoundation, ' +
  'tgt.idProject, ' +
  'prj.name AS nameProject, ' +
  'tgt.idProgram, ' +
  'prg.name AS nameProgram, ' +
  'dnt.idTarget, ' +
  'tgt.name AS nameTarget, ' +
  'dnt.idSource, ' +
  'src.name AS nameSource, ' +
  'dnt.nDoc, ' +
  'dnt.dDoc, ' +
  'dnt.remark, ' +
  'dnt.txId ' +
  'FROM ' + donationsTable + ' AS dnt ' +
  'LEFT JOIN ' + donatorsTable + ' AS dtr ON dnt.idDonator = dtr.idDonator ' +
  'LEFT JOIN ' + foundationsTable + ' AS fnd ON dnt.idFoundation = fnd.idFoundation ' +
  'LEFT JOIN ' + targetsTable + ' AS tgt ON dnt.idFoundation = tgt.idFoundation AND dnt.idTarget = tgt.idTarget ' +
  'LEFT JOIN ' + projectsTable + ' AS prj ON dnt.idFoundation = prj.idFoundation AND tgt.idProject = prj.idProject ' +
  'LEFT JOIN ' + programsTable + ' AS prg ON dnt.idFoundation = prg.idFoundation AND tgt.idProgram = prg.idProgram ' +
  'LEFT JOIN ' + sourcesTable + ' AS src ON dnt.idSource = src.idSource ' +
  ''

const expensesViewSelect = 'CREATE VIEW IF NOT EXISTS ' + expensesView + ' AS SELECT ' +
  'exp.id, ' +
  'exp.idExpense, ' +
  'exp.sum, ' +
  'exp.idCostItem, ' +
  'cst.name as costItemName, ' +
  'exp.idFoundation, ' +
  'fnd.name AS nameFoundation, ' +
  'exp.idProject, ' +
  'prj.name AS nameProject, ' +
  'exp.idProgram, ' +
  'prg.name AS nameProgram, ' +
  'exp.nDoc, ' +
  'exp.dDoc, ' +
  'exp.remark, ' +
  'exp.txId ' +
  'FROM ' + expensesTable + ' AS exp ' +
  'LEFT JOIN ' + costItemsTable + ' AS cst ON exp.idFoundation = cst.idFoundation and exp.idCostItem = cst.idCostItem ' +
  'LEFT JOIN ' + foundationsTable + ' AS fnd ON exp.idFoundation = fnd.idFoundation ' +
  'LEFT JOIN ' + projectsTable + ' AS prj ON exp.idFoundation = prj.idFoundation AND exp.idProject = prj.idProject ' +
  'LEFT JOIN ' + programsTable + ' AS prg ON exp.idFoundation = prg.idFoundation AND exp.idProgram = prg.idProgram ' +
  ''

async function createDonationsView (sequelize) {
  await dropView(donationsView, sequelize)
  await sequelize.query(donationsViewSelect)
  return true
}

async function createExpensesView (sequelize) {
  await dropView(expensesView, sequelize)
  await sequelize.query(expensesViewSelect)
  return true
}

async function createViews (sequelize) {
  await createDonationsView(sequelize)
  await createExpensesView(sequelize)
  return true
}

async function dropView (viewName, sequelize) {
  await sequelize.query('DROP VIEW IF EXISTS ' + viewName)
  return true
}

module.exports = (app) => {
  app.on('sequelize.init', (sequelize) => {
    return createViews(sequelize)
  })
}
