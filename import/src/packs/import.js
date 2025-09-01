const Ajv = require('ajv');
const request = require('../helpers/request');
const getLocalSavePath = require('../helpers/get-local-path');
const getApiUrl = require('../helpers/get-api-url');
const processPacks = require('./process');
const packsSchema = require('../../schema/packs');
const cyclesSchema = require('../../schema/cycles');
const saveData = require('../helpers/save-file');

const importPacks = async () => {
  const ajv = new Ajv();
  const packsData = await request(getApiUrl('/packs'));
  if (!ajv.validate(packsSchema(), packsData)) {
    throw new Error(`Packs data does not match schema: ${JSON.stringify(ajv.errors)}`);
  }
  const cyclesData = await request(getApiUrl('/cycles'));
  if (!ajv.validate(cyclesSchema(), cyclesData)) {
    throw new Error(`Cycles data does not match schema: ${JSON.stringify(ajv.errors)}`);
  }

  const processedPacksData = processPacks(packsData, cyclesData);
  await saveData(processedPacksData, getLocalSavePath('packs.json'));
  return processedPacksData;
};

module.exports = importPacks;
