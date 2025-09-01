const Ajv = require('ajv');
const request = require('../helpers/request');
const getLocalSavePath = require('../helpers/get-local-path');
const getApiUrl = require('../helpers/get-api-url');
const processFactions = require('./process');
const saveData = require('../helpers/save-file');
const factionsSchema = require('../../schema/factions');

const importFactions = async () => {
  const ajv = new Ajv();
  const factionApiData = await request(getApiUrl('/factions'));
  if (!ajv.validate(factionsSchema(), factionApiData)) {
    throw new Error(`Factions data does not match schema: ${JSON.stringify(ajv.errors)}`);
  }
  const processedFactionData = processFactions(factionApiData);
  await saveData(processedFactionData, getLocalSavePath('factions.json'));
};

module.exports = importFactions;
