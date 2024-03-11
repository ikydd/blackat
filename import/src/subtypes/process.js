const hasKeywords = ({ keywords }) => keywords;

const sortByName = (a, b) => {
  if (a.name === b.name) {
    return 0;
  }
  return a.name > b.name ? 1 : -1;
};

const getSubtypeData = (data, subtype, side) => {
  if (data && data.side === side) {
    return data;
  }
  if (data && data.side !== side) {
    return {
      ...data,
      side: null
    };
  }
  return {
    side,
    code: subtype,
    name: subtype
  };
};

const discoverSubtypes = (list, { side, keywords }) => {
  const subtypes = keywords.split(' - ');
  subtypes.forEach((subtype) => {
    const subtypeData = getSubtypeData(list.get(subtype), subtype, side);
    list.set(subtype, subtypeData);
  });
  return list;
};

const process = (cards) => {
  const cardsWithKeywords = cards.filter(hasKeywords);
  const subtypes = cardsWithKeywords.reduce(discoverSubtypes, new Map());

  return [...subtypes.values()].sort(sortByName);
};

module.exports = process;
