'use strict'
require('dotenv').config()

const { DefaultAzureCredential } = require('@azure/identity')
// const { CertificateClient } = require('@azure/keyvault-certificates') // Do not use, see below
const { SecretClient } = require('@azure/keyvault-secrets')
const https = require('https')
const axios = require('axios')
const helpers = require('./helpers')

// Demo setup
const serverUrl = 'https://localhost:4433/authenticate'

// Azure Setup
const AZURE_KEYVAULT_NAME = process.env.AZURE_KEYVAULT_NAME
const keyvaultUrl = `https://${AZURE_KEYVAULT_NAME}.vault.azure.net`
const credential = new DefaultAzureCredential()

// Even though certificate is stored as certificate,
// we need to use `SecretClient` to access full cert incl. private key
const secretClient = new SecretClient(keyvaultUrl, credential)

async function main() {
	// Get certificate from Azure Key Vault
	const combinedPem = await secretClient.getSecret('demo-nodejs-auth-alice-valid')

	const pem = helpers.splitCombined(combinedPem.value)

	// For more `https.Agent` options, see here:
	// https://nodejs.org/api/https.html#https_https_request_options_callback
	const agent = https.Agent({
		cert: pem.cert,
		key: pem.key,
		rejectUnauthorized: false
	})

	// Make request to test server
	axios.get(serverUrl, { httpsAgent: agent })
	.then((res) => {
		console.log('Success')
		console.log(res.data)
	})
	.catch((err) => {
		console.error(`[Error] ${err.code}`)
		// console.error(err)
	})
}

main()
