const path = require('path');
const request = require('../helpers/request');
const getLocalSavePath = require('../helpers/get-local-path');
const getApiUrl = require('../helpers/get-api-url');
const processCards = require('./process');
const downloadImages = require('./download-images');
const saveData = require('../helpers/save-file');

const imgFolder = path.join(__dirname, '..', '..', '..', 'client', 'public', 'img', 'cards');

const importCards = async (packs) => {
  const cardApiData = await request(getApiUrl('/cards'));
  const mwlApiData = await request(getApiUrl('/mwl'));
  const processedCardData = processCards(cardApiData, packs, mwlApiData);
  const cardsWithImages = await downloadImages(imgFolder, processedCardData);
  await saveData(cardsWithImages, getLocalSavePath('cards.json'));
  return cardsWithImages;
};

module.exports = importCards;
