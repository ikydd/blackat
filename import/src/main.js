const path = require("path");
const SourceApi = require("./source-api");
const Importer = require("./importer");
const cardsHandler = require("./handlers/cards");

const start = async () => {
  const nrdb = new SourceApi("https://netrunnerdb.com/api/2.0/public");
  const importer = new Importer(nrdb, path.join(__dirname, "..", "..", "data"));

  importer.import("/cards", cardsHandler);
};

module.exports = {
  start,
};
