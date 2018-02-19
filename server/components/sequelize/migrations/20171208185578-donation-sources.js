/**
 * Module 20171208185578-donation-sources.js
 *
 * Donation sources migration
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const tableName = 'DonationSources'

module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, {
      idSource: {
        type:       Sequelize.DataTypes.INTEGER(11).UNSIGNED,
        primaryKey: true,
        allowNull:  false,
      },

      name: {
        type:      Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },

      isDoubleEntry: {
        type:         Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
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

    // TODO: Здесь можно сразу заполнить таблицу, ибо в ней значения, скорее всего, редко будут меняться
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName, {force: true})
  }
}
