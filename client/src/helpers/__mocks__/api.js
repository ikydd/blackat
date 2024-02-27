import cards from '../../../../fixtures/api/cards.json';
import factions from '../../../../fixtures/api/factions.json';
import types from '../../../../fixtures/api/types.json';
import packs from '../../../../fixtures/api/packs.json';
import subtypes from '../../../../fixtures/api/subtypes.json';

const data = {
  cards,
  factions,
  types,
  subtypes,
  packs
};

let user = {};

export const setData = (type, fixture) => {
  user[type] = fixture;
};

export const reset = () => {
  user = {};
};

export default async function getData(type) {
  return user[type] || data[type];
}
