const Ajv = require('ajv');
const request = require('../helpers/request');
const getLocalSavePath = require('../helpers/get-local-path');
const getApiUrl = require('../helpers/get-api-url');
const processTypes = require('./process');
const saveData = require('../helpers/save-file');
const typesSchema = require('../../schema/types');

const importTypes = async () => {
  const ajv = new Ajv();
  const typeApiData = await request(getApiUrl('/types'));
  if (!ajv.validate(typesSchema(), typeApiData)) {
    throw new Error(`Types data does not match schema: ${JSON.stringify(ajv.errors)}`);
  }
  const processedTypeData = processTypes(typeApiData);
  await saveData(processedTypeData, getLocalSavePath('types.json'));
};

module.exports = importTypes;
