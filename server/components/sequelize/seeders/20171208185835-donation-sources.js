/**
 * Module 20171208185835-donation-sources.js
 *
 * Foundation donation sources seed
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const tableName = 'DonationSources'

const sources = [
  {
    idSource: 1,
    name:     'Via the bank account',
  },
  {
    idSource: 2,
    name:     'Via the website',
  },
  {
    idSource: 3,
    name:     'Via SMS',
  },
  {
    idSource: 4,
    name:     'Via terminals',
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return sources.length > 0 ? queryInterface.bulkInsert(tableName, sources, {}) : null
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(tableName, null, {})
  }
}
