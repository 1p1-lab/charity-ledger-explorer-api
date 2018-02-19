/**
 * Module 20171207002118-foundations.js
 *
 * Foundation migration
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const tableName = 'CharityFoundations'

module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, {
      idFoundation: {
        type:       Sequelize.DataTypes.INTEGER(11).UNSIGNED,
        primaryKey: true,
      },

      name: {
        type:      Sequelize.DataTypes.STRING(255),
        unique:    true,
        allowNull: false,
      },

      address: {
        type:      Sequelize.DataTypes.STRING(42),
        allowNull: false,
      },

      idMarketplace: {
        type:      Sequelize.DataTypes.INTEGER(11).UNSIGNED,
        allowNull: true,
      },

      website: {
        type:      Sequelize.DataTypes.STRING(255),
        allowNull: true,
      },

      createdAt: {
        type:      Sequelize.DataTypes.DATE,
        allowNull: true,
      },

      updatedAt: {
        type:      Sequelize.DataTypes.DATE,
        allowNull: true,
      },
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName, {force: true})
  }
}
