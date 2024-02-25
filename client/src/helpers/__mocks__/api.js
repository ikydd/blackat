const cards = require('../../../../fixtures/api/cards.json');
const factions = require('../../../../fixtures/api/factions.json');
const types = require('../../../../fixtures/api/types.json');
const packs = require('../../../../fixtures/api/packs.json');
const subtypes = require('../../../../fixtures/api/subtypes.json');

const data = {
  cards,
  factions,
  types,
  subtypes,
  packs
};

let user = {};

export const getData = async (type) => user[type] || data[type];

export const setData = (type, fixture) => {
  user[type] = fixture;
};

export const reset = () => {
  user = {};
};
