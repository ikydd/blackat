

const bySide = (side) => (card) => {
  if (!side) {
    return card;
  }
  if (card.side !== side) {
    card.show = false;
  }
  return card;
}

const byFactions = (factions) => (card) => {
  if (!factions.length) {
    return card;
  }
  if (!factions.includes(card.faction)) {
    card.show = false;
  }
  return card;
}

 const byTypes = (types) => (card) => {
  if (!types.length) {
    return card;
  }
  if (!types.includes(card.type)) {
    card.show = false;
  }
  return card;
}

const bySubtypes = (subtypes) => (card) => {
  if (!subtypes.length) {
    return card;
  }
  if (!subtypes.find((subtype) => card.keywords && card.keywords.search(subtype) > -1)) {
    card.show = false;
  }
  return card;
}

const byPacks = (packs) => (card) => {
  if (!packs.length) {
    return card;
  }
  if (!packs.includes(card.pack)) {
    card.show = false;
  }
  return card;
}

const byTitle = (title) => (card) => {
  if (!title) {
    return card;
  }
  const regex = new RegExp(title, 'i');
  if (card.title.search(regex) === -1) {
    card.show = false;
  }
  return card;
}

const byText = (text) => (card) => {
  if (!text) {
    return card;
  }
  const regex = new RegExp(text, 'i');
  if (card.text.search(regex) === -1) {
    card.show = false;
  }
  return card;
}

const resetDisplay = (card) => {
  card.show = true;
  return card;
}

const filter = (cards, filters) => cards
  .map(resetDisplay)
  .filter(bySide(filters.side))
  .filter(byTitle(filters.titleSearch))
  .filter(byText(filters.textSearch))
  .filter(byFactions(filters.factions))
  .filter(byTypes(filters.types))
  .filter(byPacks(filters.packs))
  .filter(bySubtypes(filters.subtypes));

export default filter;
