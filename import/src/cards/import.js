const path = require('path');
const request = require('../helpers/request');
const localPath = require('../helpers/local-path');
const apiUrlFor = require('../helpers/api-url');
const process = require('./process');
const download = require('./download-images');
const save = require('../helpers/save');

const processWith = (packs) => (cards) => process(cards, packs);
const saveTo = (filepath) => (data) => save(data, filepath).then(() => data);
const downloadImagesTo = (folder) => (data) => download(folder, data);
const folder = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'client',
  'public',
  'img',
  'cards'
);

const importCards = async (packs) =>
  request(apiUrlFor('/cards'))
    .then(processWith(packs))
    .then(downloadImagesTo(folder))
    .then(saveTo(localPath('cards.json')));

module.exports = importCards;
