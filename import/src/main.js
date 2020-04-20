const path = require("path");
const SourceApi = require("./source-api");
const Importer = require("./importer");
const cardsHandler = require("./handlers/cards");

const nrdbApi = "https://netrunnerdb.com/api/2.0/public";
const importDir = path.join(__dirname, "..", "..", "server", "data");

const start = async () => {
  const nrdb = new SourceApi(nrdbApi);
  const importer = new Importer(nrdb, importDir);

  importer.import("/cards", cardsHandler);
};

module.exports = {
  start,
};
