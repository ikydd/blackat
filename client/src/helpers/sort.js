const data = {}

const compare = (a, b) =>
  a > b
    ? 1
    : a < b
      ? -1
      : 0;

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
      return propCompare(option, a, b);
    default:
      return rankCompare(option, a, b);
  }
}

const toCodes = ({ code }) => code;

export default ({ types, packs, factions }) => {
  data.type = types.map(toCodes);
  data.pack = packs.reduce((list, { items }) => list.concat(items), []).map(toCodes);
  data.faction = factions.map(toCodes);
  return (option) => (a, b) => {
    switch (option) {
      case 'title':
          return sort('title', a, b);
      case 'illustrator':
        let ill = sort('illustrator', a, b);
        return sort('title', a, b, ill);
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
