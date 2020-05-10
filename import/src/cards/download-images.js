const fs = require('fs');
const axios = require('axios');

const cardPath = (card, path) => `${path}/${card.code}.png`;
const nonPresentCards = (path) => (card) => {
    const file = cardPath(card, path);
    return !fs.existsSync(file) || fs.statSync(file)['size'] < 200000;
}

const download = async (path, data) => {
    return Promise.all(data
        .filter(nonPresentCards(path))
        .map((card => axios({
                url: card.imagesrc,
                method: 'GET',
                responseType: "stream" })
            .then(response =>
                response.data.pipe(fs.createWriteStream(cardPath(card, path))))
            .catch(console.error)
    )));
};

module.exports = download;
