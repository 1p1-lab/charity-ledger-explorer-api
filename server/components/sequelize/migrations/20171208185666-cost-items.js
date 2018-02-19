/**
 * Module 20171208185666-cost-items.js
 *
 * Foundation cost items migtation
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const tableName = 'CostItems'

module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, {
        id: {
          type:          Sequelize.DataTypes.INTEGER(11).UNSIGNED,
          primaryKey:    true,
          autoIncrement: true,
        },

        idCostItem: {
          type:      Sequelize.DataTypes.INTEGER(11).UNSIGNED,
          allowNull: false,
        },

        name: {
          type:      Sequelize.DataTypes.STRING(255),
          allowNull: false,
        },

        idFoundation: {
          type:      Sequelize.DataTypes.INTEGER(11).UNSIGNED,
          allowNull: false,
        },

        createdAt: {
          type:      Sequelize.DataTypes.DATE,
          allowNull: true,
        },

        updatedAt: {
          type:      Sequelize.DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        indexes: [
          {
            unique: true,
            fields: ['idCostItem', 'idFoundation'],
          }
        ]
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName, {force: true})
  }
}
