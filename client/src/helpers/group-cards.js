const compare = ({ a, b, order = 'asc', numbersOnly = false }) => {
  if (a === b) {
    return 0;
  }
  if(numbersOnly && typeof a !== 'number'){
    return 1;
  }
  if(numbersOnly && typeof b !== 'number') {
    return -1;
  }
  const result = a > b ? 1 : -1;
  return order === 'asc' ? result : result * -1;
};

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

const sortSections = (sections, sort) => {
  const list = Object.values(sections);
  switch (sort) {
    case 'faction':
    case 'pack':
    case 'type':
      return list;
    case 'subroutines':
    case 'strength':
    case 'agenda':
      return list.sort((a, b) => compare({ a: a.info.code, b: b.info.code, order: 'desc', numbersOnly: true }));
    case 'cost':
      return list.sort((a, b) => compare({ a: a.info.code, b: b.info.code, numbersOnly: true }));
      case 'illustrator':
    default:
      return list.sort((a, b) => compare({ a: a.info.code, b: b.info.code }));
  }
}

export const groupCards = (
  cards = [],
  categories = { type: [], pack: [], faction: [] },
  sort = 'factions'
) => {
  const groupedCards = cards.reduce((sections, card) => {
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
        return customGroup({ sections, card, sortProp: sort, unknown: "conditional", suffix: ' agenda points' });
      case 'strength':
        return customGroup({ sections, card, sortProp: sort, suffix: ' strength' });
      case 'illustrator':
        return customGroup({ sections, card, sortProp: sort });
      default:
        return defaultGroup({ sections, card });
    }
  }, {});
  return sortSections(groupedCards, sort);
}
 