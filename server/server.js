/**
 * Module server.js
 *
 * Entrypoint script
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 *
 */

require('dotenv').load({path: './server/.env'})
const fs       = require('fs')
const loopback = require('loopback')
const boot     = require('loopback-boot')

const app = module.exports = loopback()
let server

app.start = () => {
  // start the web server
  return app.listen(() => {
    app.emit('started')
    const baseUrl = app.get('url').replace(/\/$/, '')
    console.log('\n=================================================')
    console.log('Web server listening at: %s', baseUrl)
    console.log('Environment: %s', process.env.NODE_ENV)

    // Save pid
    fs.writeFile('server.pid', process.pid, (error) => {
      if (error) {
        console.error('Cannot save pid', error)
      }
    })
  })
}

boot(app, __dirname, (error) => {
  if (error) throw error
  if (require.main === module) {
    server = app.start()
  }
})
