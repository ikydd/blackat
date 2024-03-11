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
  [...corp, ...runner].reduce((list, subtype) => {
    const subtypeAlreadyExists = list.some((prevSubtype) => prevSubtype.code === subtype);
    if (subtypeAlreadyExists) {
      return list;
    }
    const subtypeData = {
      side: getSubtypeSide({ subtype, corp, runner }),
      code: subtype,
      name: subtype
    };
    return [...list, subtypeData];
  }, []);

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
