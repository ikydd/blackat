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
    packs = []
  }
) => {
  const show =
    isRelevantToSortMethod(card, sort) &&
    isFromCorrectSide(card, side) &&
    hasMatchingTitle(card, titleSearch) &&
    hasMatchingText(card, textSearch) &&
    hasMatchingFactions(card, factions) &&
    hasMatchingType(card, types) &&
    isInMatchingPack(card, packs) &&
    hasMatchingSubtypes(card, subtypes);

  return { ...card, show };
};

const filterCardsByAllSettings = (cards, filters) =>
  cards.map((card) => setCardVisibilityFromSettings(card, filters));

export default filterCardsByAllSettings;
