/**
 * Module 20171207002118-foundations.js
 *
 * Foundations seed
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const tableName = 'CharityFoundations'

const randomAddress = () => {
  let address    = ''
  const possible = 'abcdef0123456789'

  for (let i = 0; i < 40; i++)
    address += possible.charAt(Math.floor(Math.random() * possible.length));

  return '0x' + address
}

const foundations = [
  {
    idFoundation:  1,
    name:          'Charity Blockchain Association',
    address:       randomAddress(),
    idMarketplace: 22,
    website:       'https://charityblockchain.ru/',
  },
  {
    idFoundation:  2,
    name:          'Sample Charity Foundation',
    address:       randomAddress(),
    idMarketplace: 99,
    website:       'https://charityblockchain.ru/',
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, foundations, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(tableName, null, {})
  }
}
