/**
 * Module 20171208185545-donators.js
 *
 * Donators migration
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const tableName = 'Donators'

module.exports = {

  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable(tableName, {
      idDonator: {
        type:       Sequelize.DataTypes.INTEGER(11).UNSIGNED,
        primaryKey: true,
      },

      name: {
        type:      Sequelize.DataTypes.STRING(255),
        allowNull: true,
      },

      hashEMail: {
        type:      Sequelize.DataTypes.STRING(64),
        allowNull: true,
      },

      contact: {
        type:      Sequelize.DataTypes.STRING(255),
        allowNull: true,
      },

      isPerson: {
        type:         Sequelize.DataTypes.BOOLEAN,
        defaultValue: true,
      },

      idMarketplace: {
        type:      Sequelize.DataTypes.INTEGER(11).UNSIGNED,
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
