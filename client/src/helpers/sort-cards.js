const compare = (a, b) => {
  if (a === b) {
    return 0;
  }
  if(typeof a === 'undefined'){
    return -1;
  }
  if(typeof b === 'undefined') {
    return 1;
  }
  return a > b ? 1 : -1;
};

const getPositionOfCardUsingCategory = (prop, categories, item) =>
  categories[prop].indexOf(item[prop]);

const compareUsingCategory = (prop, categories, a, b) =>
  compare(
    getPositionOfCardUsingCategory(prop, categories, a),
    getPositionOfCardUsingCategory(prop, categories, b)
  );

const compareProperty = (prop, a, b) => compare(a[prop], b[prop]);

const compareByProp = (prop, categories, a, b, result = 0) => {
  if (result !== 0) {
    return result;
  }
  switch (prop) {
    case 'title':
    case 'illustrator':
    case 'cost':
    case 'advancement':
    case 'code':
      return compareProperty(prop, a, b);
    case 'agenda':
    case 'strength':
    case 'subroutines':
      return compareProperty(prop, b, a);
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
  agenda: ['agenda', 'advancement', 'type', 'faction', 'title'],
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
