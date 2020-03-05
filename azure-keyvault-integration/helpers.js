'use strict'

/**
 * Formatting helpers
 *
 * Key Vault returns a single line string,
 * which we need to format into certificate
 */

function formatCert (str) {
	return _formater(str, '-----BEGIN CERTIFICATE-----', '-----END CERTIFICATE-----')
}

function formatKey (str) {
	return _formater(str, '-----BEGIN PRIVATE KEY-----', '-----END PRIVATE KEY-----')
}

function _formater (str, prefix, suffix) {
	const c = str.replace(prefix, '')
		.replace(suffix, '')
		.replace(' ', '')
		.replace(/(.{65})/g,'$1\n') // note line length

	return `${prefix}\n`
		+ c
		+ `\n${suffix}\n`
}

module.exports = {
	formatCert: formatCert,
	formatKey: formatKey
}