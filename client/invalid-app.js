const axios = require('axios');
const agent = require('./agent');

const serverUrl = 'https://localhost:3000/authenticate';
let opts = {
	httpsAgent: agent('bob')
};

const requestServer = async () => {
	try {
		const res = await axios.get(serverUrl, opts)
		console.log(res.data)
	} catch (err) {
		if (err.response) {
			console.log(err.response.data)
		}
		else {
			console.log(err)
		}
	}
}

requestServer()
