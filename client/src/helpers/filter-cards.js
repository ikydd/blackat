const isFromCorrectSide = (card, side) => !side || card.side === side;

const hasMatchingFactions = (card, factions) => !factions.length || factions.includes(card.faction);

const hasMatchingType = (card, types) => !types.length || types.includes(card.type);

const hasMatchingSubtypes = (card, subtypes) =>
  !subtypes.length ||
  subtypes.some((subtype) => card.keywords && card.keywords.search(subtype) !== -1);

const isInMatchingPack = (card, packs) => !packs.length || packs.includes(card.pack);

const hasMatchingTitle = (card, title) =>
  title ? card.title.search(new RegExp(title, 'i')) !== -1 : true;

const hasMatchingText = (card, text) =>
  text ? card.text.search(new RegExp(text, 'i')) !== -1 : true;

const hasRelevantProp = (card, prop) => card[prop] !== undefined;

const confersAgendaPoints = (card) =>
  card.agenda !== undefined || !!(card.text && card.text.search(/as an agenda/) !== -1);

const isMatchingOfficiality = (card, official) => !official || card.official;

const isMatchingRotation = (card, rotation) => !rotation || !card.rotated;

const isMatchingLegality = (card, legal) => !legal || !card.banned;

const isRelevantToSortMethod = (card, sort) => {
  switch (sort) {
    case 'illustrator':
    case 'cost':
    case 'strength':
    case 'subroutines':
      return hasRelevantProp(card, sort);
    case 'agenda':
      return confersAgendaPoints(card);
    default:
      return true;
  }
};

const isPreferredArt = (card, originalArt, index, list) => {
  const previous = list[index - 1];
  const next = list[index + 1];

  const hasOriginalArt = previous && previous.title === card.title;
  const hasUpdatedArt = next && next.title === card.title;

  if (hasOriginalArt && hasUpdatedArt) {
    return false;
  }
  if (originalArt && hasOriginalArt) {
    return false;
  }
  if (hasUpdatedArt) {
    return originalArt;
  }

  return true;
};

const setCardVisibilityFromSettings = (
  card,
  {
    sort = 'default',
    side = '',
    titleSearch = '',
    textSearch = '',
    factions = [],
    types = [],
    subtypes = [],
    packs = [],
    originalArt = false,
    official = false,
    rotation = false,
    legal = false
  },
  index,
  all
) => {
  return (
    isRelevantToSortMethod(card, sort) &&
    isFromCorrectSide(card, side) &&
    hasMatchingTitle(card, titleSearch) &&
    hasMatchingText(card, textSearch) &&
    hasMatchingFactions(card, factions) &&
    hasMatchingType(card, types) &&
    isInMatchingPack(card, packs) &&
    isMatchingOfficiality(card, official) &&
    isMatchingRotation(card, rotation) &&
    isMatchingLegality(card, legal) &&
    hasMatchingSubtypes(card, subtypes) &&
    isPreferredArt(card, originalArt, index, all)
  );
};

const filterCardsByAllSettings = (cards, filters) =>
  cards.filter((card, index, all) => setCardVisibilityFromSettings(card, filters, index, all));

export default filterCardsByAllSettings;
