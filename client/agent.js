const https = require('https');
const fs = require('fs');
const path = require('path');

// For more `https.Agent` options, see here:
// https://nodejs.org/api/https.html#https_https_request_options_callback

module.exports = function (name) {
	const certFile = path.resolve(__dirname, `${name}_cert.pem`);
	const keyFile = path.resolve(__dirname, `${name}_key.pem`);
	return new https.Agent({
		cert: fs.readFileSync(certFile),
		key: fs.readFileSync(keyFile),
		rejectUnauthorized: false
	});
};
