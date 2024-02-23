const cards = require('./cards/import');
const factions = require('./factions/import');
const types = require('./types/import');
const packs = require('./packs/import');
const subtypes = require('./subtypes/import');

const run = async () => {
  const packData = await packs();
  const cardData = await cards(packData);
  await factions();
  await types();
  await subtypes(cardData);
};

module.exports = {
  run
};
