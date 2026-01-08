// utils/hash.js
const crypto = require('crypto')

/**
 * Genera un hash SHA256 de un buffer o string
 * @param {Buffer|String} data - Datos a hashear
 * @returns {String} Hash SHA256 en formato hexadecimal
 */
module.exports.generateSHA256 = (data) => {
  // Asegurar que el dato sea un Buffer o String válido
  if (!data) {
    throw new Error('generateSHA256: No se proporcionaron datos para hashear')
  }
  
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')
}
