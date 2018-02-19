/**
 * Module targets.js
 * Foundation target controller
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

module.exports = (request, response) => {

  const app = request.app

  async function getAllTargets () {
    const params  = request.query || {}
    const targets = await app.services.targets.getAllTargets(params)
    response.json(targets)
  }

  async function getTargetDetails () {
    const idFoundation  = request.params.idFoundation
    const idTarget      = request.params.idTarget
    const params        = request.query || {}
    const targetDetails = await app.services.targets.getTargetDetails(idFoundation, idTarget, params)
    targetDetails ? response.json(targetDetails) : response.sendStatus(404)
  }

  return {
    getAllTargets,
    getTargetDetails,
  }
}
