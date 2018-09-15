# Client Certificate Authentication with Node.js

as opposed to username and passwords. Based on the following tutorials:

- [Authentication using HTTPS client certificates](https://medium.com/@sevcsik/authentication-using-https-client-certificates-3c9d270e8326)  
	Author: Andras Sevcsik-Zajácz, Web technology enthusiast

- [HTTPS Authorized Certs with Node.js](https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2)  
	Author: Anders Brownworth, Rethinking money @CirclePay | Co-taught the Blockchain class at MIT

## Demo

First install required dependencies with `npm install`. Then the demo works as follows:

### Start Server

```
npm run server
```

You can test this by opening [https://localhost:4433/](https://localhost:4433/) in your browser.

## Test Valid Client (Alice)

**Alice** has a valid certificate issued by server, so she can talk to the server:

```
$ npm run valid-client

> node ./client/valid-app.js

Hello Alice, your certificate was issued by localhost!
```

## Test Invalid Client (Bob)

**Bob** has a self-issued certificate, which is rejected by the server:

```
$ npm run invalid-client

> node ./client/invalid-app.js

Sorry Bob, certificates from Bob are not welcome here.
```

## Server Certificates

- CN: localhost
- O: Client Certificate Demo

```
$ openssl req -x509 -newkey rsa:4096 -keyout server_key.pem -out server_cert.pem -nodes -days 365 -subj "/CN=localhost/O=Client\ Certificate\ Demo"
```

This command shortens following _three_ commands:

- `openssl genrsa` 
- `openssl req`
- `openssl x509`

which generates _two_ files:

- `server_cert.pem`
- `erver_key.pem`

### Server

Run `npm run server` and then open [https://localhost:4433/](https://localhost:4433/)
 in browser to view the server.

## Create Client Certificates

For demo, two users are created:

- Alice, who has a valid certificate
- Bob, who creates own certificate


### Create key and Certificate Signing Request (CSR)

```
$ openssl req -newkey rsa:4096 -keyout alice_key.pem -out alice_csr.pem -nodes -days 365 -subj "/CN=Alice"
$ openssl req -newkey rsa:4096 -keyout bob_key.pem -out bob_csr.pem -nodes -days 365 -subj "/CN=Bob"
```

### Create Alice's Certificate

We create a certificate for Alice.

- sign alice's CSR...
- with our server key via `-CA` flag...
- and save results as certificate

```
$ openssl x509 -req -in alice_csr.pem -CA server_cert.pem -CAkey server_key.pem -out alice_cert.pem -set_serial 01 -days 365
```

### Create Bob's Certificate

Bob creates own without our server key.

```
$ openssl x509 -req -in bob_csr.pem -signkey bob_key.pem -out bob_cert.pem -days 365
```

## Notes

- [Let's Encrypt](https://letsencrypt.org/) is a "free, automated, and open" Certificate Authority
- **PEM**: Privacy Enhanced Mail is a Base64 encoded DER certificate

### OpenSSL commands

| Command | Documentation | Description |
|:--|:--|:--|
| `genrsa` | [Docs](https://www.openssl.org/docs/man1.0.2/apps/genrsa.html) |  Generates an RSA private key |
| **`req`** | [Docs](https://www.openssl.org/docs/man1.0.2/apps/req.html) |  Primarily creates and processes certificate requests in PKCS#10 format. It can additionally create self signed certificates for use as root CAs for example. |
| `x509` | [Docs](https://www.openssl.org/docs/man1.0.2/apps/x509.html) | The x509 command is a multi purpose certificate utility. It can be used to display certificate information, convert certificates to various forms, sign certificate requests like a "mini CA" or edit certificate trust settings. |

[View all `openssl` commands &rarr;](https://www.openssl.org/docs/man1.0.2/apps/openssl.html)
