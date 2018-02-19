/**
 * Module 20180116041202-transition-states.js
 *
 * Migration for TransitionStates table
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const tableName = 'TransitionStates'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, {
        id: {
          type:          Sequelize.DataTypes.INTEGER(11).UNSIGNED,
          primaryKey:    true,
          autoIncrement: true,
        },

        txId: {
          type:      Sequelize.DataTypes.STRING(100),
          allowNull: false,
        },

        txState: {
          type:         Sequelize.DataTypes.INTEGER(1),
          defaultValue: 1,
        },

        idFoundation: {
          type:      Sequelize.DataTypes.INTEGER(11).UNSIGNED,
          allowNull: true,
        },

        tableName: {
          type:      Sequelize.DataTypes.STRING(50),
          allowNull: false,
        },

        idRow: {
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
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName, {force: true})
  }
}
