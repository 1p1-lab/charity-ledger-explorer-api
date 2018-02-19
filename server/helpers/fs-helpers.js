/**
 * Module fs-helpers.js
 * File system helper
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const fs        = require('fs')
const path      = require('path')
const promisify = require('util').promisify

async function readFile (filePath) {
  const readFile = promisify(fs.readFile)

  let success = true
  let data, error
  try {
    data = await readFile(filePath)
  }
  catch (e) {
    error = e.message
  }

  return {success, data, error}
}

async function exists (filePath) {
  const access = promisify(fs.access)
  try {
    const error = await access(filePath, fs.F_OK)
    return !error
  }
  catch (e) {
    return false
  }
}

async function unlink (filePath) {
  const unlink = promisify(fs.unlink)
  try {
    const error = await unlink(filePath)
    return !error
  }
  catch (e) {
    return false
  }
}

async function realpath (filePath, options) {
  const realpath = promisify(fs.realpath)
  try {
    const error = await realpath(filePath, options)
    return !error
  }
  catch (e) {
    return false
  }
}

function extname (filePath) {
  const ext = path.extname(filePath)
  if (ext) {
    return ext.split('.').pop()
  }
  return ''
}

module.exports.readFile = readFile
module.exports.exists   = exists
module.exports.unlink   = unlink
module.exports.realpath = realpath
module.exports.extname  = extname
