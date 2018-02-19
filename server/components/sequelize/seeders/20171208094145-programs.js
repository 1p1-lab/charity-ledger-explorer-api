/**
 * Module 20171208094145-programs.js
 *
 * Foundation programs seed
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const tableName = 'CharityPrograms'

const programs = [
  {
    "idProgram": "1",
    "idFoundation": "2",
    "name": "№1 program. Bone marrow transplantation"
  },
  {
    "idProgram": "2",
    "idFoundation": "2",
    "name": "№2 program. Targeted assistance to patients"
  },
  {
    "idProgram": "3",
    "idFoundation": "2",
    "name": "№3 program. remunerated donation"
  },
  {
    "idProgram": "4",
    "idFoundation": "2",
    "name": "№4 program \"Fight against kantserofobiey\""
  },
  {
    "idProgram": "5",
    "idFoundation": "2",
    "name": "expenses for statutory activities"
  }
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return programs.length > 0 ? queryInterface.bulkInsert(tableName, programs, {}) : null
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(tableName, null, {})
  }
}
