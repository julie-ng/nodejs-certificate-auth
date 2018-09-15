# Client Certificate Authentication with Node.js

as opposed to username and passwords. Based on the following tutorials:

- [Authentication using HTTPS client certificates](https://medium.com/@sevcsik/authentication-using-https-client-certificates-3c9d270e8326)
	Author: Andras Sevcsik-Zajácz, Web technology enthusiast

- [HTTPS Authorized Certs with Node.js](https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2)
	Author: Anders Brownworth, Rethinking money @CirclePay | Co-taught the Blockchain class at MIT

## Misc. Notes

- Use Let's Encrypt as a Certificate Authority

## Server 

[https://localhost:4433/](https://localhost:4433/)

### Certificates

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

