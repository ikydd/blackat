const request = require('../helpers/request');
const getLocalSavePath = require('../helpers/get-local-path');
const getApiUrl = require('../helpers/get-api-url');
const processPacks = require('./process');
const saveData = require('../helpers/save-file');

const importPacks = async () => {
  const packsData = await request(getApiUrl('/packs'));
  const cyclesData = await request(getApiUrl('/cycles'));
  const processedPacksData = processPacks(packsData, cyclesData);
  await saveData(processedPacksData, getLocalSavePath('packs.json'));
  return processedPacksData;
};

module.exports = importPacks;
