const axios = require("axios");

const apiRequest = async (url) => {
    if (!url) {
      throw new Error("An API base URL is required in api-request");
    }

    const response = await axios(url);
    return response.data;
  }

module.exports = apiRequest;
