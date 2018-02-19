/**
 * Module projects.js
 * Foundation project controller
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

module.exports = (request, response) => {

  const app = request.app

  async function getAllProjects () {
    const params   = request.query || {}
    const projects = await app.services.projects.getAllProjects(params)
    response.json(projects)
  }

  async function getProjectDetails () {
    const idFoundation   = request.params.idFoundation
    const idProject      = request.params.idProject
    const params         = request.query || {}
    const projectDetails = await app.services.projects.getProjectDetails(idFoundation, idProject, params)
    projectDetails ? response.json(projectDetails) : response.sendStatus(404)
  }

  return {
    getAllProjects,
    getProjectDetails,
  }
}
