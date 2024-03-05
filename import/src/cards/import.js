const path = require('path');
const request = require('../helpers/request');
const getLocalSavePath = require('../helpers/local-path');
const getApiUrlFor = require('../helpers/api-url');
const processCards = require('./process');
const downloadImages = require('./download-images');
const saveData = require('../helpers/save');

const imgFolder = path.join(__dirname, '..', '..', '..', 'client', 'public', 'img', 'cards');

const importCards = async (packs) => {
  const cardApiData = await request(getApiUrlFor('/cards'));
  const processedCardData = processCards(cardApiData, packs);
  const cardsWithImages = await downloadImages(imgFolder, processedCardData)
  await saveData(cardsWithImages, getLocalSavePath('cards.json'));
  return cardsWithImages;
}

module.exports = importCards;
