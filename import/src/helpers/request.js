const axios = require('axios');

const request = async (url) => {
  if (!url) {
    throw new Error('A URL is required in request');
  }

  const response = await axios({
    url,
    validateStatus: (status) => {
      return status === 200;
    }
  });
  return response.data;
};

module.exports = request;
