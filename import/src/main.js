const cards = require("./cards/import");
const factions = require("./factions/import");
const types = require("./types/import");
const packs = require("./packs/import");

const run = async () => {
  const packData = await packs();
  await cards(packData);
  await factions();
  await types();
};

module.exports = {
  run,
};
