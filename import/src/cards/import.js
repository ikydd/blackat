const path = require("path");
const request = require("../request");
const save = require("../save");
const process = require("./process");

const nrdbApi = "https://netrunnerdb.com/api/2.0/public/cards";
const filepath = path.join(
  __dirname,
  "..",
  "..",
  "server",
  "data",
  "cards.json"
);

const saveTo = (filepath) => (data) => save(data, filepath);

const importCards = async () =>
  request(nrdbApi).then(process).then(saveTo(filepath));

module.exports = importCards;
