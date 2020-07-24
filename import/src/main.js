const cards = require("./cards/import");
const factions = require("./factions/import");
const types = require("./types/import");

const run = async () => {
  await cards();
  await factions();
  await types();
};

module.exports = {
  run,
};
