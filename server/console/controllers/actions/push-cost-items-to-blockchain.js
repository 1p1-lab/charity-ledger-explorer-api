/**
 * Module push-cost-items-to-blockchain.js
 *
 * Action to load foundation cost items to blockchain
 *
 * Request params:
 *    idFoundation {integer}
 *    filePath {string}
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const _  = require('lodash')
const fs = require('../../../helpers/fs-helpers')

module.exports = async (app, request, params) => {
  const idFoundation = request.idFoundation
  const filePath     = request.filePath

  // Primary validation
  if (!idFoundation) {
    throw new Error('No foundation specified')
  }
  if (!filePath) {
    throw new Error('No file specified')
  }

  const fileExists = await fs.exists(filePath)
  if (!fileExists) {
    throw new Error('File not found')
  }

  const service = app.services.costs

  let result = await service.loadFromFile(filePath)
  if (result.parsed === false) {
    throw new Error('Parse error')
  }
  else if (result.validated === false) {
    throw new Error('Validate error')
  }

  const unlockTimeout = _.get(request, 'unlockTimeout')

  params = _.extend({unlockTimeout}, params)
  result = await service.pushCostItemsToBlockchain(idFoundation, result.items, params)
  if (result.pending) {
    throw new Error('Blockchain has pending operations')
  }
}
