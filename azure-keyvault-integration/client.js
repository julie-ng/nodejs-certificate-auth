require('dotenv').config()

const https = require('https')
const axios = require('axios')
const { DefaultAzureCredential } = require('@azure/identity')
const { SecretClient } = require('@azure/keyvault-secrets')

const AZURE_KEYVAULT_NAME = process.env.AZURE_KEYVAULT_NAME
const KV_CERT_NAME = process.env.CERTIFICATE_ALICE_KV_NAME
const serverUrl = 'https://localhost:4433/authenticate';
const keyvaultUrl = `https://${AZURE_KEYVAULT_NAME}.vault.azure.net`

const credential = new DefaultAzureCredential()
const client = new SecretClient(keyvaultUrl, credential)

async function main() {
	const certificate = await client.getSecret('demo-cert-auth-alice-cert')
	const key = await client.getSecret('demo-cert-auth-alice-key')
	// console.log(formatCert(certificate.value))
	// console.log(formatKey(key.value))

	// custom agent with certificate
	const agent = https.Agent({
		cert: formatCert(certificate.value),
		key: formatKey(key.value),
		rejectUnauthorized: false
	})

	axios.get(serverUrl, { httpsAgent: agent })
	.then((res) => {
		console.log('Accessed')
		console.log(res.data)
	})
	.catch((err) => {
		console.error(`[Error] ${err.code}`)
		// console.error(err)
	})
}

// Run
main()

/**
 * Formatting helpers
 *
 * Key Vault returns a single line string,
 * which we need to format into certificate
 */
const CERT_BEGIN = '-----BEGIN CERTIFICATE-----'
const CERT_END = '-----END CERTIFICATE-----'
const KEY_BEGIN = '-----BEGIN PRIVATE KEY-----'
const KEY_END = '-----END PRIVATE KEY-----'


function formatCert (str) {
	return _formater(str, CERT_BEGIN, CERT_END)
}

function formatKey (str) {
	return _formater(str, KEY_BEGIN, KEY_END)
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

// function wrapCert (base64) {
// 	return `-----BEGIN CERTIFICATE-----\n` + base64 + `\n-----END CERTIFICATE-----\n`
// }
