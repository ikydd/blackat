const fs = require('fs');
const request = require("../helpers/request");
const localPath = require('../helpers/local-path');
const getApiUrl = require('../helpers/api-url');
const process = require("./process");
const download = require("./download-images");
const save = require("../helpers/save");

const saveTo = (filepath) => (data) => { return save(data, filepath).then(() => data); }
const downloadImagesTo = (folder) => (data) => download(folder, data);
const folder = fs.realpathSync(`${__dirname}/../../../client/public/img/cards`);

const importCards = async () =>
    getApiUrl("/cards")
        .then(request)
        .then(process)
        .then(saveTo(localPath("cards.json")))
        .then(downloadImagesTo(folder));

module.exports = importCards;
