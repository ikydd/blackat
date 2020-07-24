const cards = require("./cards/import");
const factions = require("./factions/import");
const types = require("./types/import");
const packs = require("./packs/import");

const run = async () => {
  await cards();
  await factions();
  await types();
  await packs();
};

module.exports = {
  run,
};
