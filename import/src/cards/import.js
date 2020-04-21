const request = require("../request");
const localPath = require('../helpers/local-path');
const getApiUrl = require('../helpers/api-url');
const process = require("./process");
const save = require("../save");

const saveTo = (filepath) => (data) => save(data, filepath);

const importCards = async () =>
    getApiUrl("/cards")
        .then(request)
        .then(process)
        .then(saveTo(localPath("cards.json")));

module.exports = importCards;
