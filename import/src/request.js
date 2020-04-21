const axios = require("axios");

const request = async (url) => {
  if (!url) {
    throw new Error("A URL is required in request");
  }

  const response = await axios(url);
  return response.data;
};

module.exports = request;
