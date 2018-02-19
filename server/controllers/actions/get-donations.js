/**
 * Module get-donations.js
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

module.exports = async (app, request, response, params) => {

  const query = request.query || {}

  // const sequelize = app.sequelize
  // const Donation  = sequelize.getModel('Donation')
  //const donations = await Donation.buildQuery(query).all()
  const donations = await app.services.donations.getDonations(query)
  response.json(donations)
}