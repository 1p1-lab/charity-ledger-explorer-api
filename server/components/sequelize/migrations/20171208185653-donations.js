/**
 * Module 20171208185653-donations.js
 *
 * Foundation donations migration
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const tableName = 'Donations'

module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, {
        id: {
          type:          Sequelize.DataTypes.INTEGER(11).UNSIGNED,
          primaryKey:    true,
          autoIncrement: true,
        },

        idDonation: {
          type:      Sequelize.DataTypes.INTEGER(11).UNSIGNED,
          allowNull: false,
        },

        idDonator: {
          type:      Sequelize.DataTypes.INTEGER(11).UNSIGNED,
          allowNull: true,
        },

        nameDonator: {
          type:      Sequelize.DataTypes.STRING(255),
          allowNull: true,
        },

        idSource: {
          type:      Sequelize.DataTypes.INTEGER(11).UNSIGNED,
          allowNull: false,
        },

        sum: {
          type:      Sequelize.DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },

        idFoundation: {
          type:      Sequelize.DataTypes.INTEGER(11).UNSIGNED,
          allowNull: false,
        },

        idTarget: {
          type:      Sequelize.DataTypes.INTEGER(11).UNSIGNED,
          allowNull: false,
        },

        nDoc: {
          type:      Sequelize.DataTypes.STRING(32),
          allowNull: true,
        },

        dDoc: {
          type:      Sequelize.DataTypes.DATE,
          allowNull: true,
        },

        remark: {
          type:      Sequelize.DataTypes.STRING(255),
          allowNull: true,
        },

        txId: {
          type:      Sequelize.DataTypes.STRING(100),
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
            fields: ['idDonation', 'idFoundation', 'idTarget'],
          }
        ]
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName, {force: true})
  }
}
