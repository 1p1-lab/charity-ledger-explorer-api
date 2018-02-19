/**
 * Module 20171207005300-programs.js
 *
 * Foundation programs migration
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const tableName = 'CharityPrograms'

module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, {
        id: {
          type:          Sequelize.DataTypes.INTEGER(11).UNSIGNED,
          primaryKey:    true,
          autoIncrement: true,
          allowNull:     false,
        },

        idProgram: {
          type:      Sequelize.DataTypes.INTEGER(11).UNSIGNED,
          allowNull: false,
        },

        idFoundation: {
          type:      Sequelize.DataTypes.INTEGER(11).UNSIGNED,
          allowNull: false,
        },

        name: {
          type:      Sequelize.DataTypes.STRING(255),
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
      },
      {
        indexes: [
          {
            unique: true,
            fields: ['idProgram', 'idFoundation'],
          }
        ]
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName, {force: true})
  }
}
