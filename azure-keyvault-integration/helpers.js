'use strict'

/**
 * Formatting helpers
 *
 * Key Vault returns a single line string,
 * which we need to format into certificate
 */

function _formatter (str, prefix, suffix) {
	const c = str.replace(prefix, '')
		.replace(suffix, '')
		.replace(' ', '')
		.replace(/(.{65})/g,'$1\n') // note line length

	return `${prefix}\n`
		+ c
		+ `\n${suffix}\n`
}

module.exports = {
	wrapCert: function (str) {
		return _formatter(
			str,
			'-----BEGIN CERTIFICATE-----',
			'-----END CERTIFICATE-----'
		)
	},

	wrapKey: function (str) {
		return _formatter(
			str,
			'-----BEGIN PRIVATE KEY-----',
			'-----END PRIVATE KEY-----'
		)
	},

	splitCombined: function (str) {
		const certs = {}
		const mapper = {}
		const pems = str.split('-----\n' + '-----')
		mapper['PRIVATE KEY'] = 'key'
		mapper['CERTIFICATE'] = 'cert'

		pems.forEach((pem, i) => {
			pem = (i < pems.length - 1)
				? pem + '-----\n'
				: '-----' + pem

			Object.keys(mapper).forEach((key) => {
				if (pem.includes(key)) {
					certs[mapper[key]] = pem
				}
			})
		})

		return certs
	}
}