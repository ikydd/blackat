/* eslint-disable camelcase */
const isNeutralFaction = (faction) => faction.name.includes('Neutral');

const sortByName = (a, b) => {
  if (a.name === b.name) {
    return 0;
  }
  if (isNeutralFaction(a)) {
    return 1;
  }
  if (isNeutralFaction(b)) {
    return -1;
  }
  return a.name > b.name ? 1 : -1;
};

const process = ({ data: factions }) =>
  factions
    .map(({ name, code, side_code }) => ({
      code,
      name,
      side: side_code
    }))
    .sort(sortByName);

module.exports = process;
