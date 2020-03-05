'use strict';
const axios = require('axios');
const agent = require('./agent');

const serverUrl = 'https://localhost:3000/';
let opts = {
	httpsAgent: agent('alice')
};

const requestServer = async () => {
        try {
                const res = await axios.get(serverUrl, opts);
                console.log(res.data);
        } catch (err) {
                if (err.response) {
                        console.log(err.response.data);
                }
                else {
                        console.log(err);
                }
        }
}

requestServer();
