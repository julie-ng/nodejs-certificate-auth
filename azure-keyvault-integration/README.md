# Storing Certificates in Azure Keyvault

This folder shows how to use [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/) to store the certificates, instead of loading them from the file system.

## How to Use

### Part I - Setup Key Vault

1. Create an Azure Key Vault
2. Store the certificate as a **secret***, separating the parts:
	- `alice_cert.pem`
	- `alice_key.pem`

3. Create a service principal (SP) 
	```
	az ad sp create-for-rbac \
		-n SP_NAME_OF_YOUR_CHOICE \
		--skip-assignment
	```

3. Give SP permissions to read secrets:
	```
	az keyvault set-policy \
		--name $AZURE_KEYVAULT_NAME \
		--spn $AZURE_CLIENT_ID \
		--secret-permissions \
			get \
			getissuers \
			list \
			listissuers
	```

_* Do not select the "certificate" type, which is more appropriate for end-to-end use in the Azure ecosystem.._

### Part II - Run Demo

#### Configure Environment `.env` file

First, create a copy of `.env.sample`, rename it to `.env` and fill in your values based on setup above.

#### Run Code

Next, start the server

```bash
npm run server
```

Then in another teminal session, run the Azure version with

```bash
npm run azure-client
```

If configured probably, you should see:

```
Hello Alice, your certificate was issued by localhost!
```