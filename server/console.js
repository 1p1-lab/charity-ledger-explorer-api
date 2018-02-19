/**
 * Module import.js
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 * @see     https://github.com/tj/commander.js
 */

// Load envinroment
require('dotenv').load({path: __dirname + '/.env'})

const EventEmitter = require('events').EventEmitter
const program      = require('commander')
const _            = require('lodash')
const fs           = require('fs')
const path         = require('path')
const appRoot      = require('app-root-path').path

// Console app :)
const app = _.extend({console: true}, EventEmitter.prototype)

const componentsConfig = require('./component-config.json')

let logger = console

async function appInit () {

  const serverPath = path.join(appRoot, 'server')
  const bootPath   = path.join(serverPath, 'boot')

  // Boot services
  const servicesPath = path.join(bootPath, 'services.js')
  const services     = require(servicesPath)
  services(app)

  // Boot database views
  const viewsPath = path.join(bootPath, 'views.js')
  const views     = require(viewsPath)
  views(app)

  // Initialize components
  const promises = _.map(componentsConfig, (options, name) => {
    const componentPath = path.join(serverPath, name)
    if (fs.existsSync(componentPath)) {
      const component = require(componentPath)
      return component(app, options)
    }
    return false
  })

  await Promise.all(promises)

  logger = app.loggers.app

}

// TODO: move to config
const CONTROLLERS_PATH = path.join(appRoot, 'server', 'console', 'controllers')

const getController = (name) => {
  return require(path.join(CONTROLLERS_PATH, name))
}

async function importPrograms (filePath, options) {
  const idFoundation  = options.foundation
  const unlockTimeout = options.unlockTimeout
  const request       = {app, idFoundation, filePath, unlockTimeout}

  const controller = getController('programs')
  await controller(request).importProgramsToBlockchain()
}

async function updatePrograms (options) {
  const idFoundation = options.foundation
  const request      = {app, idFoundation}

  const controller = getController('programs')
  await controller(request).updateProgramsFromBlockchain()
}

async function importProjects (filePath, options) {
  const idFoundation  = options.foundation
  const unlockTimeout = options.unlockTimeout
  const request       = {app, idFoundation, filePath, unlockTimeout}

  const controller = getController('projects')
  await controller(request).importProjectsToBlockchain()
}

async function updateProjects (options) {
  const idFoundation = options.foundation
  const request      = {app, idFoundation}

  const controller = getController('projects')
  await controller(request).updateProjectsFromBlockchain()
}

async function importTargets (filePath, options) {
  const idFoundation  = options.foundation
  const unlockTimeout = options.unlockTimeout
  const request       = {app, idFoundation, filePath, unlockTimeout}

  const controller = getController('targets')
  await controller(request).importTargetsToBlockchain()
}

async function updateTargets (options) {
  const idFoundation = options.foundation
  const request      = {app, idFoundation}

  const controller = getController('targets')
  await controller(request).updateTargetsFromBlockchain()
}

async function importCostItems (filePath, options) {
  const idFoundation  = options.foundation
  const unlockTimeout = options.unlockTimeout
  const request       = {app, idFoundation, filePath, unlockTimeout}

  const controller = getController('costs')
  await controller(request).importCostItemsToBlockchain()
}

async function updateCostItems (options) {
  const idFoundation = options.foundation
  const request      = {app, idFoundation}

  const controller = getController('costs')
  await controller(request).updateCostItemsFromBlockchain()
}

async function importDonators (filePath, options) {
  const unlockTimeout = options.unlockTimeout
  const request       = {app, filePath, unlockTimeout}

  const controller = getController('donators')
  await controller(request).importDonatorsToBlockchain()
}

async function updateDonators (options) {
  const request = {app}

  const controller = getController('donators')
  await controller(request).updateDonatorsFromBlockchain()
}

async function importDonations (filePath, options) {
  const idFoundation  = options.foundation
  const unlockTimeout = options.unlockTimeout
  const request       = {app, idFoundation, filePath, unlockTimeout}

  const controller = getController('donations')
  await controller(request).importDonationsToBlockchain()
}

async function updateDonations (options) {
  const idFoundation = options.foundation
  const minDate      = options.minDate
  const maxDate      = options.maxDate
  const request      = {app, idFoundation, minDate, maxDate}

  const controller = getController('donations')
  await controller(request).updateDonationsFromBlockchain()
}

async function importExpenses (filePath, options) {
  const idFoundation  = options.foundation
  const unlockTimeout = options.unlockTimeout
  const request       = {app, idFoundation, filePath, unlockTimeout}

  const controller = getController('expenses')
  await controller(request).importExpensesToBlockchain()
}

async function updateExpenses (options) {
  const idFoundation = options.foundation
  const minDate      = options.minDate
  const maxDate      = options.maxDate
  const request      = {app, idFoundation, minDate, maxDate}

  const controller = getController('expenses')
  await controller(request).updateExpensesFromBlockchain()
}

// Setup console commands
const info = require('../package.json')
program
  .version(info.version)
  .description('1+1 Blockchain console application')

program
  .command('programs:update')
  .description('Load programs of specified foundation from blockchain to local storage')
  .option('-f, --foundation <UID>', 'foundation UID')
  .action(updatePrograms)

program
  .command('programs:import <filePath>')
  .description('Import programs of specified foundation from CSV-file to blockchain')
  .option('-f, --foundation <UID>', 'foundation UID')
  .option('--unlock-timeout [secs]', 'unlock account timeout (in seconds)')
  .action(importPrograms)

program
  .command('projects:update')
  .description('Load projects of specified foundation from blockchain to local storage')
  .option('-f, --foundation <UID>', 'foundation UID')
  .action(updateProjects)

program
  .command('projects:import <filePath>')
  .description('Import projects of specified foundation from CSV-file to blockchain')
  .option('-f, --foundation <UID>', 'foundation UID')
  .option('--unlock-timeout [secs]', 'unlock account timeout (in seconds)')
  .action(importProjects)

program
  .command('targets:update')
  .description('Load targets of specified foundation from blockchain to local storage')
  .option('-f, --foundation <UID>', 'foundation UID')
  .action(updateTargets)

program
  .command('targets:import <filePath>')
  .description('Import targets of specified foundation from CSV-file to blockchain')
  .option('-f, --foundation <UID>', 'foundation UID')
  .option('--unlock-timeout [secs]', 'unlock account timeout (in seconds)')
  .action(importTargets)

program
  .command('costs:update')
  .description('Load cost items of specified foundation from blockchain to local storage')
  .option('-f, --foundation <UID>', 'foundation UID')
  .action(updateCostItems)

program
  .command('costs:import <filePath>')
  .description('Import cost items of specified foundation from CSV-file to blockchain')
  .option('-f, --foundation <UID>', 'foundation UID')
  .option('--unlock-timeout [secs]', 'unlock account timeout (in seconds)')
  .action(importCostItems)

program
  .command('donators:update')
  .description('Load donators from blockchain to local storage')
  .action(updateDonators)

program
  .command('donators:import <filePath>')
  .description('Import donators from CSV-file to blockchain')
  .option('--unlock-timeout [secs]', 'unlock account timeout (in seconds)')
  .action(importDonators)

program
  .command('donations:update')
  .description('Import donations for specified foundation')
  .option('-f, --foundation <UID>', 'foundation UID')
  .option('--min-date [YYYY-MM-DD]', 'min date')
  .option('--max-date [YYYY-MM-DD]', 'max date')
  .action(updateDonations)

program
  .command('donations:import <filePath>')
  .description('Import donations for specified foundation')
  .option('-f, --foundation <UID>', 'foundation UID')
  .option('--unlock-timeout [secs]', 'unlock account timeout (in seconds)')
  .action(importDonations)

program
  .command('expenses:update')
  .description('Import expenses for specified foundation')
  .option('-f, --foundation <UID>', 'foundation UID')
  .option('--min-date [YYYY-MM-DD]', 'min date')
  .option('--max-date [YYYY-MM-DD]', 'max date')
  .action(updateExpenses)

program
  .command('expenses:import <filePath>')
  .description('Import expenses for specified foundation')
  .option('-f, --foundation <UID>', 'foundation UID')
  .option('--unlock-timeout [secs]', 'unlock account timeout (in seconds)')
  .action(importExpenses)

async function main () {
  await appInit()
  app.emit('started')
  program.parse(process.argv)
}

return main()

