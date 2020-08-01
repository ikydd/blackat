const fs = require('fs-extra');
const axios = require('axios');

const cardPath = (card, path) => `${path}/${card.code}.png`;
const existingCards = (path) => (card) => {
    const file = cardPath(card, path);
    return !fs.existsSync(file) || fs.statSync(file)['size'] < 200000;
}

const createFolder = fs.ensureDir;

const downloadCardTo = (path) => (card) => axios({
        url: card.imagesrc,
        method: 'GET',
        responseType: "stream" })
    .then(response =>
        response.data.pipe(fs.createWriteStream(cardPath(card, path))))
    .catch(console.error)

const download = async (path, data) => {
    return createFolder(path)
        .then(() => Promise.all(data
            .filter(existingCards(path))
            .map(downloadCardTo(path))
        ));
}

module.exports = download;
