

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
  if (!subtypes.filter((subtype) => card.keywords && card.keywords.search(subtype) !== -1).length) {
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
  if (card.title.search(regex) < 0) {
    card.show = false;
  }
  return card;
}

const byText = (text) => (card) => {
  if (!text) {
    return card;
  }
  const regex = new RegExp(text, 'i');
  if (card.text.search(regex) < 0) {
    card.show = false;
  }
  return card;
}

export default {
    byFactions,
    byPacks,
    bySubtypes,
    bySide,
    byText,
    byTypes,
    byTitle
}
