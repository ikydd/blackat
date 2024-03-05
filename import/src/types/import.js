const request = require('../helpers/request');
const getLocalSavePath = require('../helpers/get-local-path');
const getApiUrl = require('../helpers/get-api-url');
const processTypes = require('./process');
const saveData = require('../helpers/save-file');

const importTypes = async () => {
  const typeApiData = await request(getApiUrl('/types'));
  const processedTypeData = processTypes(typeApiData);
  await saveData(processedTypeData, getLocalSavePath('types.json'));
};

module.exports = importTypes;
