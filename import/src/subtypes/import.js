const localPath = require("../helpers/local-path");
const process = require("./process");
const save = require("../helpers/save");

const saveTo = (filepath) => (data) => save(data, filepath).then(() => data);

const importSubtypes = async (cards) =>
  Promise.resolve(cards)
    .then(process)
    .then(saveTo(localPath("subtypes.json")));

module.exports = importSubtypes;
