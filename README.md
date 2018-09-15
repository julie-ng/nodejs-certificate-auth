# Client Certificate Authentication with Node.js

as opposed to username and passwords. Based on the following tutorials:

- [Authentication using HTTPS client certificates](https://medium.com/@sevcsik/authentication-using-https-client-certificates-3c9d270e8326)  
	Author: Andras Sevcsik-Zajácz, Web technology enthusiast

- [HTTPS Authorized Certs with Node.js](https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2)  
	Author: Anders Brownworth, Rethinking money @CirclePay | Co-taught the Blockchain class at MIT

## Misc. Notes

- Use Let's Encrypt as a Certificate Authority

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

