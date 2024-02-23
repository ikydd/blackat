const neutralLast = (faction) =>
  faction.name.search('Neutral') !== -1 ? 'zzzzzzz' : faction.name;
const byName = (a, b) => (neutralLast(a) > neutralLast(b) ? 1 : -1);

const process = ({ data: factions }) =>
  factions
    // eslint-disable-next-line camelcase
    .map(({ name, code, side_code }) => ({
      code,
      name,
      side: side_code
    }))
    .sort(byName);

module.exports = process;
