/* eslint-disable no-console */
const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

const getImageSavePath = (card, folder) => path.join(folder, `${card.code}.png`);

const imageAlreadyDownloaded = (card, imgFolder) => {
  const imgPath = getImageSavePath(card, imgFolder);
  return !fs.existsSync(imgPath) || fs.statSync(imgPath).size < 30000;
};

const downloadImage = async (filepath, url) => {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
      response.data
      .pipe(fs.createWriteStream(filepath))
      .on('close', () => resolve())
      .on('error', (error) => reject(error));
  });
}

const downloadCardImageToFolder = async (card, imgFolder) => {
  try {
    const locationToSaveImage = getImageSavePath(card, imgFolder);
    await downloadImage(locationToSaveImage, card.imagesrc);
  } catch (e) {
    console.error(e);
  }
}


const downloadImages = (data, imgFolder) => {
  const cardsMissingImages = data.filter((card) => imageAlreadyDownloaded(card, imgFolder));
  return Promise.all(cardsMissingImages.map((card) => downloadCardImageToFolder(card, imgFolder)));
}
    
const getWebFolderPath = (serverFolder) => {
  const segments = serverFolder.split('/');
  const publicFolderIndex = segments.indexOf('public');
  const webSegments = segments.slice(publicFolderIndex + 1);
  return `/${webSegments.join('/')}/`;
}

const addImagePathToCards = (data, imgFolder) => {
  const webFolder = getWebFolderPath(imgFolder);
  return data.map((card) => ({ ...card, imagesrc: getImageSavePath(card, webFolder) }));
};
const download = async (imgFolder, data) => {
  await fs.ensureDir(imgFolder);
  await downloadImages(data, imgFolder);
  return addImagePathToCards(data, imgFolder);
};

module.exports = download;
