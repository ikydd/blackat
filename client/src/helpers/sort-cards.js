const compare = (a, b, order = 'asc') => {
  if (a === b) {
    return 0;
  }
  const lastPosition = order === 'asc' ? Infinity : -1;
  if (a === 'X') {
    return compare(lastPosition, b, order);
  }
  if (b === 'X') {
    return compare(a, lastPosition, order);
  }
  if (typeof a === 'undefined') {
    return 1;
  }
  if (typeof b === 'undefined') {
    return -1;
  }
  const result = a > b ? 1 : -1;
  return order === 'asc' ? result : result * -1;
};

const getPositionOfCardUsingCategory = (prop, categories, item) =>
  categories[prop].indexOf(item[prop]);

const compareUsingCategory = (prop, categories, a, b) =>
  compare(
    getPositionOfCardUsingCategory(prop, categories, a),
    getPositionOfCardUsingCategory(prop, categories, b)
  );

const compareProperty = (prop, a, b, order = 'asc') => compare(a[prop], b[prop], order);

const compareByProp = (prop, categories, a, b, result = 0) => {
  if (result !== 0) {
    return result;
  }
  switch (prop) {
    case 'title':
    case 'illustrator':
    case 'code':
    case 'cost':
    case 'advancement':
      return compareProperty(prop, a, b);
    case 'agenda':
    case 'strength':
    case 'subroutines':
      return compareProperty(prop, a, b, 'desc');
    case 'faction':
    case 'type':
    case 'pack':
    default:
      return compareUsingCategory(prop, categories, a, b);
  }
};

const compareByMultipleProps = (list, categories, a, b) =>
  list.reduce((comparison, property) => compareByProp(property, categories, a, b, comparison), 0);

const toCodes = ({ code }) => code;

const multiComparisonLists = {
  illustrator: ['illustrator', 'title'],
  type: ['type', 'faction', 'title'],
  cost: ['cost', 'type', 'faction', 'title'],
  agenda: ['agenda', 'faction', 'advancement', 'type', 'title'],
  strength: ['strength', 'subroutines', 'cost', 'faction', 'title'],
  subroutines: ['subroutines', 'strength', 'cost', 'faction', 'title'],
  faction: ['faction', 'type', 'title'],
  pack: ['pack', 'code']
};

export const prepareSortingData = ({ types, packs, factions }) => ({
  type: types.map(toCodes),
  pack: packs.reduce((list, group) => list.concat(group.items), []).map(toCodes),
  faction: factions.map(toCodes)
});

export const sortCards = (
  cards = [],
  categories = { type: [], pack: [], faction: [] },
  sortMethod = 'faction'
) => {
  const multipleSortMethods = multiComparisonLists[sortMethod];
  return multipleSortMethods
    ? cards.sort((a, b) => compareByMultipleProps(multipleSortMethods, categories, a, b))
    : cards.sort((a, b) => compareByProp(sortMethod, categories, a, b));
};
