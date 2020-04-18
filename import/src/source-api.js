const axios = require('axios');

class SourceApi {

    constructor(baseUrl) {
        if (!baseUrl) {
            throw new Error('An API base URL is required in the SourceAPI');
        }
        this.baseUrl = baseUrl;
    }

    async call(path) {
        const fullUrl = `${this.baseUrl}${path}`;
        const response = await axios(fullUrl);
        return response.data;
    }
}

module.exports = SourceApi;
