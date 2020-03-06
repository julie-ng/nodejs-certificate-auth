'use strict'
require('dotenv').config()

const { DefaultAzureCredential } = require('@azure/identity')
const { SecretClient } = require('@azure/keyvault-secrets')
const https = require('https')
const axios = require('axios')
const helpers = require('./helpers')

// Demo setup
const serverUrl = 'https://localhost:4433/authenticate'
const kevaultSecrets = {
	cert: 'demo-cert-auth-alice-cert',
	key: 'demo-cert-auth-alice-key'
}

// Azure Setup
const AZURE_KEYVAULT_NAME = process.env.AZURE_KEYVAULT_NAME
const keyvaultUrl = `https://${AZURE_KEYVAULT_NAME}.vault.azure.net`
const credential = new DefaultAzureCredential()
const client = new SecretClient(keyvaultUrl, credential)

async function main() {
	// Get certificates stored as secrets in Key Vault
	const certificate = await client.getSecret(kevaultSecrets.cert)
	const key = await client.getSecret(kevaultSecrets.key)

	// For more `https.Agent` options, see here:
	// https://nodejs.org/api/https.html#https_https_request_options_callback
	const agent = https.Agent({
		cert: helpers.wrapCert(certificate.value),
		key: helpers.wrapKey(key.value),
		rejectUnauthorized: false
	})

	// Make request to test server
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

main()
