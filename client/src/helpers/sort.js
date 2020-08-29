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

      case 'cost':
        let cost = sort('cost', a, b);
        cost = sort('faction', a, b, cost);
        cost = sort('type', a, b, cost);
        return sort('title', a, b, cost);

      case 'agenda':
        let points = sort('agenda', a, b);
        points = sort('type', a, b, points);
        points = sort('faction', a, b, points);
        points = sort('advancement', a, b, points);
        return sort('title', a, b, points);

      case 'strength':
        let strength = sort('strength', a, b);
        strength = sort('subroutines', a, b, strength);
        return sort('title', a, b, strength);

      case 'subroutines':
        let subs = sort('subroutines', a, b);
        subs = sort('strength', a, b, subs);
        return sort('title', a, b, subs);

      case 'faction':
      default:
        let faction = sort('faction', a, b);
        faction = sort('type', a, b, faction);
        return sort('title', a, b, faction);
    }
  }
}
