

const bySide = (side) => (card) => {
  if (!side) {
    return true;
  }
  return card.side === side;
}

const byFactions = (factions) => (card) => {
  if (!factions.length) {
    return true;
  }
  return factions.includes(card.faction);
}

 const byTypes = (types) => (card) => {
  if (!types.length) {
    return true;
  }
  return types.includes(card.type);
}

const bySubtypes = (subtypes) => (card) => {
  if (!subtypes.length) {
    return true;
  }
  return subtypes.find((subtype) => card.keywords && card.keywords.search(subtype) !== -1);
}

const byPacks = (packs) => (card) => {
  if (!packs.length) {
    return true;
  }
  return packs.includes(card.pack);
}

const byTitle = (title) => (card) => {
  if (!title) {
    return true;
  }
  const regex = new RegExp(title, 'i');
  return card.title.search(regex) > 0;
}

const byText = (text) => (card) => {
  if (!text) {
    return true;
  }
  const regex = new RegExp(text, 'i');
  return card.text.search(regex) > 0;
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
