import cards from "@repo/testing-fixtures/api/cards.json";
import factions from "@repo/testing-fixtures/api/factions.json";
import types from "@repo/testing-fixtures/api/types.json";
import packs from "@repo/testing-fixtures/api/packs.json";
import subtypes from "@repo/testing-fixtures/api/subtypes.json";
import timestamp from "@repo/testing-fixtures/api/timestamp.json";

const data = {
  cards,
  factions,
  types,
  subtypes,
  packs,
  timestamp,
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
