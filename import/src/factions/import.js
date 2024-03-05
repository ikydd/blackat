const request = require('../helpers/request');
const getLocalSavePath = require('../helpers/get-local-path');
const getApiUrl = require('../helpers/get-api-url');
const processFactions = require('./process');
const saveData = require('../helpers/save-file');

const importFactions = async () => {
  const factionApiData = await request(getApiUrl('/factions'));
  const processedFactionData = processFactions(factionApiData);
  await saveData(processedFactionData, getLocalSavePath('factions.json'));
};

module.exports = importFactions;
