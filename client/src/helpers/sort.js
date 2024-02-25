const data = {};

const compare = (a, b) => {
  if (a === b) {
    return 0;
  }
  return a > b ? 1 : -1;
};

const rankOf = (prop, item) => data[prop].indexOf(item[prop]);

const rankCompare = (prop, a, b) => compare(rankOf(prop, a), rankOf(prop, b));

const propCompare = (prop, a, b) => compare(a[prop], b[prop]);

const sort = (option, a, b, result = 0) => {
  if (result !== 0) {
    return result;
  }
  switch (option) {
    case 'title':
    case 'illustrator':
    case 'cost':
    case 'advancement':
      return propCompare(option, a, b);
    case 'agenda':
    case 'strength':
    case 'subroutines':
      return propCompare(option, b, a);
    default:
      return rankCompare(option, a, b);
  }
};

const toCodes = ({ code }) => code;

const sortByIllustrator = (a, b) => {
  const ill = sort('illustrator', a, b);
  return sort('title', a, b, ill);
};

const sortByType = (a, b) => {
  let type = sort('type', a, b);
  type = sort('faction', a, b, type);
  return sort('title', a, b, type);
};

const sortByCost = (a, b) => {
  let cost = sort('cost', a, b);
  cost = sort('faction', a, b, cost);
  cost = sort('type', a, b, cost);
  return sort('title', a, b, cost);
};

const sortByAgenda = (a, b) => {
  let points = sort('agenda', a, b);
  points = sort('type', a, b, points);
  points = sort('faction', a, b, points);
  points = sort('advancement', a, b, points);
  return sort('title', a, b, points);
};

const sortByStrength = (a, b) => {
  let strength = sort('strength', a, b);
  strength = sort('subroutines', a, b, strength);
  return sort('title', a, b, strength);
};

const sortBySubroutines = (a, b) => {
  let subs = sort('subroutines', a, b);
  subs = sort('strength', a, b, subs);
  return sort('title', a, b, subs);
};

const sortByFaction = (a, b) => {
  let faction = sort('faction', a, b);
  faction = sort('type', a, b, faction);
  return sort('title', a, b, faction);
};

const sortingCallback = ({ types, packs, factions }) => {
  data.type = types.map(toCodes);
  data.pack = packs.reduce((list, { items }) => list.concat(items), []).map(toCodes);
  data.faction = factions.map(toCodes);
  return (option) => (a, b) => {
    switch (option) {
      case 'title':
        return sort('title', a, b);

      case 'illustrator':
        return sortByIllustrator(a, b);

      case 'type':
        return sortByType(a, b);

      case 'pack':
        return sort('pack', a, b);

      case 'cost':
        return sortByCost(a, b);

      case 'agenda':
        return sortByAgenda(a, b);

      case 'strength':
        return sortByStrength(a, b);

      case 'subroutines':
        return sortBySubroutines(a, b);

      case 'faction':
      default:
        return sortByFaction(a, b);
    }
  };
};

export default sortingCallback;
