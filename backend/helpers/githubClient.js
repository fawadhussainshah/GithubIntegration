const axios = require('axios');
const Integration = require('../models/Integration');

const getAccessToken = async () => {
  const integration = await Integration.findOne({});
  if (!integration) throw new Error('No GitHub integration found');
  return integration.accessToken;
};

const githubRequest = async (url) => {
  const token = await getAccessToken();
  const response = await axios.get(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json'
    }
  });
  return response.data;
};

module.exports = {
  githubRequest
};
