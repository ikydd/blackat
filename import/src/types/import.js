const request = require("../helpers/request");
const localPath = require('../helpers/local-path');
const getApiUrl = require('../helpers/api-url');
const process = require("./process");
const save = require("../save");

const saveTo = (filepath) => (data) => { return save(data, filepath).then(() => data); }

const importFactions = async () =>
    getApiUrl("/types")
        .then(request)
        .then(process)
        .then(saveTo(localPath("types.json")));

module.exports = importFactions;
