/**
 * Module projects.js
 * Foundation projects console controller
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

module.exports = (request) => {

  const app = request.app

  async function updateProjectsFromBlockchain () {
    const action = require('./actions/pull-projects-from-blockchain')
    return action(app, request)
  }

  async function importProjectsToBlockchain () {
    const action = require('./actions/push-projects-to-blockchain')
    return action(app, request)
  }

  return {
    updateProjectsFromBlockchain,
    importProjectsToBlockchain,
  }
}