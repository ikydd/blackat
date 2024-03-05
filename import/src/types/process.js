/* eslint-disable camelcase */
const typeList = [
  'identity',
  'program',
  'hardware',
  'resource',
  'event',
  'agenda',
  'ice',
  'asset',
  'upgrade',
  'operation'
];

const sortByType = (a, b) => {
  if (a.code === b.code) {
    return 0;
  }
  return typeList.indexOf(a.code) > typeList.indexOf(b.code) ? 1 : -1;
};

const ignoreSubtypes = ({ is_subtype }) => !is_subtype;

const process = ({ data: types }) =>
  types
    .filter(ignoreSubtypes)
    .map(({ name, code, side_code }) => ({
      code,
      name,
      side: side_code
    }))
    .sort(sortByType);

module.exports = process;
