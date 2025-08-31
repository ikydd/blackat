const compare = ({ a, b, order = 'asc', numbersOnly = false }) => {
  if (a === b) {
    return 0;
  }
  if (numbersOnly && typeof a !== 'number') {
    return 1;
  }
  if (numbersOnly && typeof b !== 'number') {
    return -1;
  }
  const result = a > b ? 1 : -1;
  return order === 'asc' ? result : result * -1;
};

const ensureSection = (sections, groupInfo, groupCode = 'default') => {
  return (
    sections[groupCode] || {
      info: groupInfo,
      cards: []
    }
  );
};

const addCard = (section, card) => {
  return {
    ...section,
    cards: section.cards.concat(card)
  };
};

const safelyAddCardToGroup = (sections, card, groupInfo, groupCode = 'default', max = Infinity) => {
  const section = ensureSection(sections, groupInfo, groupCode, max);
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

const customGroup = ({
  sections,
  card,
  sortProp,
  icon,
  unknown = 'ignored',
  suffix = '',
  max = Infinity
}) => {
  const groupCode = typeof card[sortProp] === 'undefined' ? unknown : card[sortProp];
  const name = typeof groupCode === 'number' && groupCode >= max ? `${max}+` : groupCode;
  const groupInfo = { name: `${name}${suffix}`, code: groupCode, icon };
  return safelyAddCardToGroup(sections, card, groupInfo, name);
};
const sortSections = (sections, sort) => {
  switch (sort) {
    case 'faction':
    case 'pack':
    case 'type':
      return sections;
    case 'subroutines':
    case 'strength':
    case 'agenda':
      return sections.sort((a, b) =>
        compare({ a: a.info.code, b: b.info.code, order: 'desc', numbersOnly: true })
      );
    case 'cost':
      return sections.sort((a, b) =>
        compare({ a: a.info.code, b: b.info.code, numbersOnly: true })
      );
    case 'illustrator':
    default:
      return sections.sort((a, b) => compare({ a: a.info.code, b: b.info.code }));
  }
};

const groupCards = (
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
        return customGroup({ sections, card, sortProp: sort, icon: 'credit', max: 9 });
      case 'subroutines':
        return customGroup({ sections, card, sortProp: sort, icon: 'subroutine', max: 4 });
      case 'agenda':
        return customGroup({
          sections,
          card,
          sortProp: sort,
          unknown: 'conditional',
          suffix: ' agenda points',
          max: 4
        });
      case 'strength':
        return customGroup({ sections, card, sortProp: sort, suffix: ' strength', max: 6 });
      case 'illustrator':
        return customGroup({ sections, card, sortProp: sort });
      default:
        return defaultGroup({ sections, card });
    }
  }, {});
  return sortSections(Object.values(groupedCards), sort);
};

export default groupCards;
