const hasKeywords = ({ keywords }) => keywords;

const sortByName = (a, b) => {
  if (a.name === b.name) {
    return 0;
  }
  return a.name > b.name ? 1 : -1;
};

const getSubtypeSide = ({ subtype, corp, runner }) => {
  if (!runner.has(subtype)) {
    return 'corp';
  }
  return corp.has(subtype) ? null : 'runner';
};

const buildSubtypeObjects = ({ corp, runner }) =>
  [...corp, ...runner].map((subtype) => ({
    side: getSubtypeSide({ subtype, corp, runner }),
    code: subtype,
    name: subtype
  }));

const addSubtypesToSides = (sets, { side, keywords }) => {
  const subtypes = keywords.split(' - ');
  subtypes.forEach((subtype) => {
    sets[side].add(subtype);
  });
  return sets;
};

const process = (cards) => {
  const cardsWithKeywords = cards.filter(hasKeywords);
  const sets = {
    runner: new Set(),
    corp: new Set()
  };
  const { runner, corp } = cardsWithKeywords.reduce(addSubtypesToSides, sets);

  return buildSubtypeObjects({ runner, corp }).sort(sortByName);
};

module.exports = process;
