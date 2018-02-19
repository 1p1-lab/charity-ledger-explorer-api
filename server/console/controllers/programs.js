/**
 * Module programs.js
 * Foundation programs console controller
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

module.exports = (request) => {

  const app = request.app

  async function updateProgramsFromBlockchain () {
    const action = require('./actions/pull-programs-from-blockchain')
    return action(app, request)
  }

  async function importProgramsToBlockchain () {
    const action = require('./actions/push-programs-to-blockchain')
    return action(app, request)
  }

  return {
    updateProgramsFromBlockchain,
    importProgramsToBlockchain,
  }
}