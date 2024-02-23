/* eslint-disable no-console */
const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

const cardPath = (card, target) => path.join(target, `${card.code}.png`);
const existingCards = (filepath) => (card) => {
  const file = cardPath(card, filepath);
  return !fs.existsSync(file) || fs.statSync(file).size < 30000;
};

const createFolder = fs.ensureDir;

const saveImageTo = (target, card) => (response) =>
  new Promise((resolve, reject) =>
    response.data
      .pipe(fs.createWriteStream(cardPath(card, target)))
      .on('close', () => resolve())
      .on('error', (error) => reject(error))
  );

const downloadCardTo = (target) => (card) =>
  axios({
    url: card.imagesrc,
    method: 'GET',
    responseType: 'stream'
  })
    .then(saveImageTo(target, card))
    .catch(console.error);

const setLocalImage = (serverFolder) => {
  const segments = serverFolder.split('/');
  const webFolder = `/${segments.slice(segments.indexOf('public') + 1).join('/')}/`;
  return (card) => ({ ...card, imagesrc: `${webFolder}${card.code}.png` });
};

const download = async (imgFolder, data) => {
  return createFolder(imgFolder)
    .then(() => Promise.all(data.filter(existingCards(imgFolder)).map(downloadCardTo(imgFolder))))
    .then(() => data.map(setLocalImage(imgFolder)));
};

module.exports = download;
