const cards = require("./cards/import");
const factions = require("./factions/import");

const run = async () => {
  await cards();
  await factions();
};

module.exports = {
  run,
};
