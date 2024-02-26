/* eslint-disable no-param-reassign */
const ensureSection = (sections, groupInfo, groupCode = 'default') => {
  if (sections[groupCode]) {
    return sections[groupCode];
  }
  return {
    show: false,
    info: groupInfo,
    cards: []
  };
};

const addCard = (section, card) => {
  section.cards.push(card);
  return {
    ...section,
    show: card.show || section.show
  };
};

const safelyAddCardToGroup = (sections, card, groupInfo, groupCode = 'default') => {
  const section = ensureSection(sections, groupInfo, groupCode);
  return {
    ...sections,
    [groupCode]: addCard(section, card)
  };
};

const standardGroup = (sections, card, groups, sortProp) => {
  const groupCode = card[sortProp];
  const groupInfo = groups.find(({ code }) => code === groupCode);
  return safelyAddCardToGroup(sections, card, groupInfo, groupCode);
};

const defaultGroup = (sections, card) => {
  return safelyAddCardToGroup(sections, card);
};

const customGroup = (sections, card, sortProp) => {
  const ignoreCard = card[sortProp] === undefined;
  if (ignoreCard) {
    return sections;
  }
  const groupCode = card[sortProp];
  const groupInfo = { name: groupCode, code: groupCode };
  return safelyAddCardToGroup(sections, card, groupInfo, groupCode);
};

export const prepareGroupingData = ({ types, packs, factions }) => ({
  type: types,
  pack: packs.reduce((list, { items }) => list.concat(items), []),
  faction: factions
});

export const groupCards = (
  cards = [],
  categories = { type: [], pack: [], faction: [] },
  sort = 'factions'
) =>
  cards.reduce((sections, card) => {
    switch (sort) {
      case 'faction':
      case 'pack':
      case 'type':
        return standardGroup(sections, card, categories[sort], sort);
      case 'illustrator':
        return customGroup(sections, card, sort);
      default:
        return defaultGroup(sections, card);
    }
  }, {});
