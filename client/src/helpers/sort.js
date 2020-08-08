const data = {}

const compare = (a, b) =>
  a > b
    ? 1
    : (a < b
      ? -1
      : 0);

const sort = (option, a, b, result = 0) => {
  if (result !== 0) {
    return result;
  }
  switch (option) {
    case 'type':
      return compare(data.types.indexOf(a.type), data.types.indexOf(b.type));
    case 'pack':
      return compare(data.packs.indexOf(a.pack), data.packs.indexOf(b.pack));
    case 'faction':
      return compare(data.factions.indexOf(a.faction), data.factions.indexOf(b.faction));
    case 'title':
    default:
      return compare(a.title, b.title);
  }
}

export default ({ types, packs, factions }) => {
  data.types = types.map(({ code }) => code);
  data.packs = packs.map(({ code }) => code);
  data.factions = factions.map(({ code }) => code);
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
