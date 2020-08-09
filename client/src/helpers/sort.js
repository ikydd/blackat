const data = {}

const compare = (a, b) =>
  a > b
    ? 1
    : (a < b
      ? -1
      : 0);

const rankOf = (prop, item) => data[prop].indexOf(item[prop]);

const standardCompare = (prop, a, b) => compare(rankOf(prop, a), rankOf(prop, b));

const sort = (option, a, b, result = 0) => {
  if (result !== 0) {
    return result;
  }
  switch (option) {
    case 'title':
      return compare(a.title, b.title);
    default:
      return standardCompare(option, a, b);
  }
}

const toCodes = ({ code }) => code;

export default ({ types, packs, factions }) => {
  data.type = types.map(toCodes);
  data.pack = packs.map(toCodes);
  data.faction = factions.map(toCodes);
  return (option) => (a, b) => {
    switch (option) {
      case 'title':
          return sort('title', a, b);
      case 'type':
        let type = sort('type', a, b);
        type = sort('faction', a, b, type);
        return sort('title', a, b, type);
      case 'pack':
        return sort('pack', a, b);
      case 'faction':
      default:
        let faction = sort('faction', a, b);
        faction = sort('type', a, b, faction);
        return sort('title', a, b, faction);
    }
  }
}
