/* eslint-disable no-console */
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

const getImageSavePath = (card, folder) =>
  path.join(folder, `${card.code}.png`);

const downloadImage = async (filepath, url) => {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on("close", () => resolve())
      .on("error", (error) => reject(error));
  });
};

const downloadCardImageToFolder = async (card, imgFolder) => {
  try {
    console.log(`Downloading ${card.imagesrc}`);
    const locationToSaveImage = getImageSavePath(card, imgFolder);
    await downloadImage(locationToSaveImage, card.imagesrc);
  } catch (e) {
    console.error(e);
  }
};

const imageAlreadyDownloaded = (card, imgFolder) => {
  const imgPath = getImageSavePath(card, imgFolder);
  return !fs.existsSync(imgPath) || fs.statSync(imgPath).size < 30000;
};

const downloadImages = async (data, imgFolder) => {
  const cardsMissingImages = data.filter((card) =>
    imageAlreadyDownloaded(card, imgFolder)
  );

  const fin = cardsMissingImages.reduce(async (prev, card) => {
    await prev;
    return downloadCardImageToFolder(card, imgFolder);
  }, Promise.resolve());

  await fin;
};

const download = async (imgFolder, data) => {
  await fs.ensureDir(imgFolder);
  await downloadImages(data, imgFolder);
};

module.exports = download;
