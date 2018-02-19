/**
 * Module programs.js
 * Foundation program controller
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

module.exports = (request, response) => {
  const app = request.app

  async function getAllPrograms () {
    const params   = request.query || {}
    const programs = await app.services.programs.getAllPrograms(params)
    response.json(programs)
  }

  async function getProgramDetails () {
    const idFoundation   = request.params.idFoundation
    const idProgram      = request.params.idProgram
    const params         = request.query || {}
    const programDetails = await app.services.programs.getProgramDetails(idFoundation, idProgram, params)
    programDetails ? response.json(programDetails) : response.sendStatus(404)
  }

  return {
    getAllPrograms,
    getProgramDetails,
  }
}
