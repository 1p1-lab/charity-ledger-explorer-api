/**
 * Module donators.js
 *
 * Donators controller
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

module.exports = (request, response) => {

  const app       = request.app
  const sequelize = app.sequelize
  const Donator   = sequelize.getModel('Donator')
  const i18n      = app.i18n

  async function findByEmail () {
    const email = request.body.email || request.query.email
    if (!email) {
      const message = i18n.__('EMAIL_IS_NOT_SPECIFIED')
      const error   = {message}
      response.status(422).json({error})
    }
    else {
      const message = i18n.__('EMAIL_NOT_FOUND')
      const error   = {message}
      const donator = await Donator.buildQuery({email}).one()
      donator ? response.json(donator) : response.status(404).json({error})
    }
  }

  return {
    findByEmail,
  }
}
