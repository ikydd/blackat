const request = require("../helpers/request");
const localPath = require('../helpers/local-path');
const apiUrlFor = require('../helpers/api-url');
const process = require("./process");
const save = require("../helpers/save");

const saveTo = (filepath) => (data) => save(data, filepath).then(() => data);

const importPacks = async () =>
    request(apiUrlFor("/packs"))
        .then(process)
        .then(saveTo(localPath("packs.json")));

module.exports = importPacks;
