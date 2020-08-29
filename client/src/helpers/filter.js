const bySide = (side) => (card) => side ? card.side === side : true;

const byFactions = (factions) => (card) => factions.length ? factions.includes(card.faction) : true;

const byTypes = (types) => (card) => types.length ? types.includes(card.type) : true;

const bySubtypes = (subtypes) => (card) => subtypes.length
  ? !!subtypes.find((subtype) => card.keywords && card.keywords.search(subtype) > -1)
  : true;

const byPacks = (packs) => (card) => packs.length ? packs.includes(card.pack) : true;

const byTitle = (title) => (card) => title ? card.title.search(new RegExp(title, 'i')) !== -1 : true;

const byText = (text) => (card) => text ? card.text.search(new RegExp(text, 'i')) !== -1 : true;

const propFilter = (prop) => (card) => card[prop] !== undefined;

const bySort = (sort) => {
  switch (sort) {
    case 'illustrator':
    case 'cost':
    case 'strength':
    case 'subroutines':
      return propFilter(sort);
    case 'agenda':
      return ({ agenda, text }) => agenda !== undefined || !!(text && text.search(/as an agenda/) !== -1);
    default:
      return () => true;
  }
}

const filterByAll = ({
    sort,
    side,
    titleSearch,
    textSearch,
    factions,
    types,
    packs,
    subtypes
  }) => {
    const sortCb = bySort(sort);
    const sideCb = bySide(side);
    const titleCb = byTitle(titleSearch);
    const textCb = byText(textSearch);
    const factionsCb = byFactions(factions);
    const typesCb = byTypes(types);
    const packsCb = byPacks(packs);
    const subtypesCb = bySubtypes(subtypes);

    return (card) => {
      card.show = sortCb(card)
        && sideCb(card)
        && titleCb(card)
        && textCb(card)
        && factionsCb(card)
        && typesCb(card)
        && packsCb(card)
        && subtypesCb(card);
      return card;
    }
}

const resetDisplay = (card) => {
  card.show = true;
  return card;
}

const filter = (cards, filters) => cards
  .map(resetDisplay)
  .map(filterByAll(filters))

export default filter;
