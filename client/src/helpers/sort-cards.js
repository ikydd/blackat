const compare = (a, b) => {
  if (a === b) {
    return 0;
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

const comparePropertyAsc = (prop, a, b) => compare(a[prop], b[prop]);

const comparePropertyDesc = (prop, a, b) => compare(b[prop], a[prop]);

const compareByProp = (prop, categories, a, b, result = 0) => {
  if (result !== 0) {
    return result;
  }
  switch (prop) {
    case 'title':
    case 'illustrator':
    case 'cost':
    case 'advancement':
      return comparePropertyAsc(prop, a, b);
    case 'agenda':
    case 'strength':
    case 'subroutines':
      return comparePropertyDesc(prop, a, b);
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
  cost: ['cost', 'faction', 'type', 'title'],
  agenda: ['agenda', 'type', 'faction', 'advancement', 'title'],
  strength: ['strength', 'subroutines', 'title'],
  subroutines: ['subroutines', 'strength', 'title'],
  faction: ['faction', 'type', 'title']
};

const generateSortingCallback = ({ types, packs, factions }) => {
  const categories = {
    type: types.map(toCodes),
    pack: packs.reduce((list, group) => list.concat(group.items), []).map(toCodes),
    faction: factions.map(toCodes)
  };

  return (method = 'faction') =>
    (a, b) => {
      if (multiComparisonLists[method]) {
        return compareByMultipleProps(multiComparisonLists[method], categories, a, b);
      }
      return compareByProp(method, categories, a, b);
    };
};

export default generateSortingCallback;
