/**
 * Module DonationView.js
 *
 * Foundation donation view model
 *  idDonation      integer
 *  sum             float
 *  idDonator       integer
 *  nameDonator     string(255)
 *  isPerson        bool
 *  idFoundation    integer
 *  nameFoundation  string(255)
 *  idProject       integer
 *  nameProject     string(255)
 *  idProgram       integer
 *  nameProgram     string(255)
 *  idTarget        integer
 *  nameTarget      string(255)
 *  idSource        integer
 *  nameSource      string(255)
 *  nDoc            string(32)
 *  dDoc            datetime
 *  remark          string(255)
 *  txId            string(100)
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const modelName   = 'DonationView'
const tableName   = 'DonationsView'
const underscored = false
const timestamps  = false

const options = {
  tableName, underscored, timestamps,

  getterMethods: {
    anonDonator () {
      const name = this.nameDonator
      return name ? name.substring(0, 1) + '*****' : null
    },
  },
}

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(modelName, {
    idDonation:     DataTypes.INTEGER(11).UNSIGNED,
    sum:            DataTypes.DECIMAL(10, 2),
    idDonator:      DataTypes.INTEGER(11).UNSIGNED,
    nameDonator:    DataTypes.STRING(255),
    hashDonator:    DataTypes.STRING(255),
    isPerson:       DataTypes.BOOLEAN,
    idFoundation:   DataTypes.INTEGER(11).UNSIGNED,
    nameFoundation: DataTypes.STRING(255),
    idProject:      DataTypes.INTEGER(11).UNSIGNED,
    nameProject:    DataTypes.STRING(255),
    idProgram:      DataTypes.INTEGER(11).UNSIGNED,
    nameProgram:    DataTypes.STRING(255),
    idTarget:       DataTypes.INTEGER(11).UNSIGNED,
    nameTarget:     DataTypes.STRING(255),
    idSource:       DataTypes.INTEGER(11).UNSIGNED,
    nameSource:     DataTypes.STRING(255),
    nDoc:           DataTypes.STRING(32),
    dDoc:           DataTypes.DATE,
    remark:         DataTypes.STRING(255),
    txId:           DataTypes.STRING(100),
  }, options)
}
