const cards = require('./cards/import');
const factions = require('./factions/import');
const types = require('./types/import');
const packs = require('./packs/import');
const subtypes = require('./subtypes/import');
const timestamp = require('./timestamp/process');

const run = async () => {
  const packData = await packs();
  const cardData = await cards(packData);
  await factions();
  await types();
  await subtypes(cardData);
  await timestamp();
};

module.exports = {
  run
};
