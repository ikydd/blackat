const request = require("../helpers/request");
const localPath = require('../helpers/local-path');
const apiUrlFor = require('../helpers/api-url');
const process = require("./process");
const save = require("../helpers/save");

const saveTo = (filepath) => (data) => save(data, filepath).then(() => data);

const importFactions = async () =>
    request(apiUrlFor("/types"))
        .then(process)
        .then(saveTo(localPath("types.json")));

module.exports = importFactions;
