/**
 * Module 20171207004300-projects.js
 *
 * Foundation projects migration
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const tableName = 'CharityProjects'

module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, {
        id: {
          type:          Sequelize.DataTypes.INTEGER(11).UNSIGNED,
          primaryKey:    true,
          autoIncrement: true,
        },

        idProject: {
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

        isPerson: {
          type:         Sequelize.DataTypes.BOOLEAN,
          defaultValue: true
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
            fields: ['idProject', 'idFoundation'],
          }
        ]
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName, {force: true})
  }
}
