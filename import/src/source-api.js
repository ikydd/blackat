const axios = require('axios');

class SourceApi {

    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async call(path) {
        const fullUrl = `${this.baseUrl}${path}`;
        const response = await axios(fullUrl);
        return response.data;
    }
}

module.exports = SourceApi;
