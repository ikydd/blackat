const fs = require('fs');
const axios = require('axios');

const cardPath = (card, path) => `${path}/${card.code}.png`;
const nonPresentCards = (path) => (card) => !fs.existsSync(cardPath(card, path));

const download = async (path, data) => {
    return Promise.all(data
        .filter(nonPresentCards(path))
        .map((card => axios({
                url: card.imagesrc,
                method: 'GET',
                responseType: "stream" })
            .then(response =>
                response.data.pipe(fs.createWriteStream(cardPath(card, path))))
    )));
};

module.exports = download;
