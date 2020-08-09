const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

const cardPath = (card, target) => path.join(target, `${card.code}.png`);
const existingCards = (path) => (card) => {
    const file = cardPath(card, path);
    return !fs.existsSync(file) || fs.statSync(file)['size'] < 200000;
}

const createFolder = fs.ensureDir;

const downloadCardTo = (target) => (card) => axios({
        url: card.imagesrc,
        method: 'GET',
        responseType: "stream" })
    .then(response =>
        response.data.pipe(fs.createWriteStream(cardPath(card, target))))
    .catch(console.error)

const download = async (imgFolder, data) => {
    return createFolder(imgFolder)
        .then(() => Promise.all(data
            .filter(existingCards(imgFolder))
            .map(downloadCardTo(imgFolder))
        ))
        .then(() => data);
}

module.exports = download;
