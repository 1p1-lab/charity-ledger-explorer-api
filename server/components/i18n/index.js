/**
 * Module index.js
 *
 * Initialize i18n component
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.2.0
 */

const i18n = require('i18n')

module.exports = (app, options) => {
  i18n.configure(options)
  app['i18n'] = i18n
}
