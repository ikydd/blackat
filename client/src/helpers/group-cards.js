/* eslint-disable no-param-reassign */
const ensureSection = (sections, groupInfo, groupCode = 'default') => {
  return (
    sections[groupCode] || {
      show: false,
      info: groupInfo,
      cards: []
    }
  );
};

const addCard = (section, card) => {
  return {
    ...section,
    cards: section.cards.concat(card),
    show: card.show || section.show
  };
};

const safelyAddCardToGroup = (sections, card, groupInfo, groupCode = 'default') => {
  const section = ensureSection(sections, groupInfo, groupCode);
  const updatedSection = addCard(section, card);
  return {
    ...sections,
    [groupCode]: updatedSection
  };
};

const standardGroup = ({ sections, card, groups, sortProp }) => {
  const groupCode = card[sortProp];
  const groupInfo = groups.find(({ code }) => code === groupCode);
  return safelyAddCardToGroup(sections, card, groupInfo, groupCode);
};

const defaultGroup = ({ sections, card }) => {
  return safelyAddCardToGroup(sections, card);
};

const customGroup = ({ sections, card, sortProp, icon, unknown = "ignored", suffix = '' }) => {
  const groupCode = typeof card[sortProp] === 'undefined' ? unknown : card[sortProp];
  const groupInfo = { name: `${groupCode}${suffix}`, code: groupCode, icon };
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
        return standardGroup({ sections, card, groups: categories[sort], sortProp: sort });
      case 'cost':
        return customGroup({ sections, card, sortProp: sort, icon: 'credit' });
      case 'subroutines':
        return customGroup({ sections, card, sortProp: sort, icon: 'subroutine' });
      case 'agenda':
        return customGroup({ sections, card, sortProp: sort, unknown: "card-based", suffix: ' agenda points' });
      case 'strength':
        return customGroup({ sections, card, sortProp: sort, suffix: ' strength' });
      case 'illustrator':
        return customGroup({ sections, card, sortProp: sort });
      default:
        return defaultGroup({ sections, card });
    }
  }, {});
