/**
 * Module routes.js
 *
 * Application routes
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const fs         = require('fs')
const bodyParser = require('body-parser')
const multer     = require('multer')
const _          = require('lodash')
const appRoot    = require('app-root-path').path
const i18n       = require('i18n')

module.exports = function (app) {
  const router = app.loopback.Router()

  // Init i18n
  app.use(i18n.init)

  app.use(function (req, res, next) {
    i18n.setLocale(req.getLocale())
    next()
  })

  const restApiRoot = app.get('restApiRoot')

  const uploadPath = fs.realpathSync(appRoot + process.env.UPLOAD_DIR)
  const upload     = multer({dest: uploadPath})
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath)
  }

  // For PUT/POST requests
  app.use(bodyParser.json())

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *                      FOUNDATIONS
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  router.get(restApiRoot + '/foundations', (request, response) => {
    const controller = require('../controllers/foundations')
    return controller(request, response).getAll()
  })

  router.get(restApiRoot + '/foundations/:idFoundation', (request, response) => {
    const controller = require('../controllers/foundations')
    return controller(request, response).getByID()
  })

  router.get(restApiRoot + '/foundations/:idFoundation/projects/:idProject', (request, response) => {
    const controller = require('../controllers/projects')
    return controller(request, response).getProjectDetails()
  })

  router.get(restApiRoot + '/foundations/:idFoundation/programs/:idProgram', (request, response) => {
    const controller = require('../controllers/programs')
    return controller(request, response).getProgramDetails()
  })

  router.get(restApiRoot + '/foundations/:idFoundation/targets/:idTarget', (request, response) => {
    const controller = require('../controllers/targets')
    return controller(request, response).getTargetDetails()
  })

  router.get(restApiRoot + '/donations', (request, response) => {
    const controller = require('../controllers/donations')
    return controller(request, response).getDonations()
  })

  router.post(restApiRoot + '/login', (request, response) => {
    const controller = require('../controllers/donators')
    return controller(request, response).findByEmail()
  })

  /**
   * CLIENT REQUESTS
   */

  const CLIENT_ROOT   = appRoot + '/client/dist/'
  const CLIENT_STATIC = CLIENT_ROOT + 'static/'

  // Static resources
  router.get('/static/(*)', (request, response) => {
    const filePath = CLIENT_STATIC + request.params[0]
    fs.existsSync(filePath) ? response.sendFile(filePath) : response.sendStatus(404)
  })

  // sitemap.xml
  router.get('/sitemap\.xml', (request, response) => {
    const filePath = CLIENT_ROOT + 'sitemap.xml'
    fs.existsSync(filePath) ? response.sendFile(filePath) : response.sendStatus(404)
  })

  // robots.txt
  router.get('/robots\.txt', (request, response) => {
    const filePath = CLIENT_ROOT + 'robots.txt'
    fs.existsSync(filePath) ? response.sendFile(filePath) : response.sendStatus(404)
  })

  // SPA entrypoint
  router.get('/*', (request, response) => {
    response.sendFile(CLIENT_ROOT + 'index.html')
  })

  app.use(router)
}
