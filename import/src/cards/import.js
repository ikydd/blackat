const Ajv = require('ajv');
const path = require('path');
const request = require('../helpers/request');
const getLocalSavePath = require('../helpers/get-local-path');
const getApiUrl = require('../helpers/get-api-url');
const processCards = require('./process');
const downloadImages = require('./download-images');
const saveData = require('../helpers/save-file');
const cardsSchema = require('../../schema/cards');
const mwlSchema = require('../../schema/mwl');

const imgFolder = path.join(__dirname, '..', '..', '..', 'client', 'public', 'img', 'cards');

const importCards = async (packs) => {
  const ajv = new Ajv();
  const cardApiData = await request(getApiUrl('/cards'));
  if (!ajv.validate(cardsSchema(), cardApiData)) {
    throw new Error(`Cards data does not match schema: ${JSON.stringify(ajv.errors)}`);
  }
  const mwlApiData = await request(getApiUrl('/mwl'));
  if (!ajv.validate(mwlSchema(), mwlApiData)) {
    throw new Error(`MWL data does not match schema: ${JSON.stringify(ajv.errors)}`);
  }
  const processedCardData = processCards(cardApiData, packs, mwlApiData);
  const cardsWithImages = await downloadImages(imgFolder, processedCardData);
  await saveData(cardsWithImages, getLocalSavePath('cards.json'));
  return cardsWithImages;
};

module.exports = importCards;
