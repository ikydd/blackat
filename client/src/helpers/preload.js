const filterItemsBySide = (options, currentSide) =>
  options.filter(({ side }) => !side || side === currentSide);

const filterAllOptionsBySide = ({ factions, types, subtypes }, side) => {
  return {
    factions: filterItemsBySide(factions, side),
    types: filterItemsBySide(types, side),
    subtypes: filterItemsBySide(subtypes, side)
  };
};

export const preloadFilters = ({ factions, types, subtypes }) => ({
  runner: filterAllOptionsBySide({ factions, types, subtypes }, 'runner'),
  corp: filterAllOptionsBySide({ factions, types, subtypes }, 'corp')
});

export const preloadGroupingData = ({ types, packs, factions }) => ({
  type: types,
  pack: packs.reduce((list, { items }) => list.concat(items), []),
  faction: factions
});

const toCodes = ({ code }) => code;

export const preloadSortingData = ({ types, packs, factions }) => ({
  type: types.map(toCodes),
  pack: packs.reduce((list, group) => list.concat(group.items), []).map(toCodes),
  faction: factions.map(toCodes)
});
