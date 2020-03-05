const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');

const opts = {
	key: fs.readFileSync(path.join(__dirname, 'server_key.pem')),
	cert: fs.readFileSync(path.join(__dirname, 'server_cert.pem')),
	requestCert: true,
	rejectUnauthorized: false, // so we can do own error handling
	ca: [
		fs.readFileSync(path.join(__dirname, 'server_cert.pem'))
	]
};

const app = express();

app.get('/', (req, res) => {
	res.send('<p>You successfully accessed the protected content !</p>');
});

app.use((req, res, next) => {
	console.log('Authentication middleware triggered on %s', req.url)
	const cert = req.socket.getPeerCertificate();
	if (req.client.authorized) {
                next()
        } else if (cert.subject) {
                res.status(403)
                         .send(`Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`);
        } else {
                res.status(401)
                   .send(`Sorry, but you need to provide a client certificate to continue.`);
        }
})


const server = https.createServer(opts, app)

server.listen(app.get('port'), app.get('host'), () => {
	var baseUrl = `https://${app.get('host')}:${app.get('port')}`
	console.log('Server listening at : %s', baseUrl)
})
