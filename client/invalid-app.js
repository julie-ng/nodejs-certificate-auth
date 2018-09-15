const axios = require('axios');
const https = require('https');
const fs = require('fs');
const path = require('path');

const serverUrl = 'https://localhost:4433/authenticate';

// Configure certifcate options
const certFile = path.resolve(__dirname, 'bob_cert.pem');
const keyFile = path.resolve(__dirname, 'bob_key.pem');
let agent = new https.Agent({
	cert: fs.readFileSync(certFile),
	key: fs.readFileSync(keyFile),
	rejectUnauthorized: false
});
let opts = { httpsAgent: agent };

// Test with Promises
axios.get(serverUrl, opts)
	.then((res) => {
		console.log(res.data);
	})
	.catch((err) => {
		console.error(err.response.data);
	});

