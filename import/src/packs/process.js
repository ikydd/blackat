/* eslint-disable camelcase */
const doesPackBelongToCycle = ({ cycle }, { code }) => code === cycle;

const addPacksIntoCycles = (cycles, pack) => {
  const matchingCycle = cycles.find((cycle) => doesPackBelongToCycle(pack, cycle));
  matchingCycle.items.push({
    ...pack,
    rotated: matchingCycle.rotated
  });
  return cycles;
};

const OFFICIAL_NETRUNNER_END_DATE = '2018-09-07';
const isOfficalPack = (date) => date < OFFICIAL_NETRUNNER_END_DATE;

const unusedPacks = ['tdc', 'draft', 'napd'];
const removeUnusedPacks = ({ code }) => !unusedPacks.includes(code);

const removeCyclesWithNoPacks = ({ items }) => items.length;

const markCyclesAsOfficial = (cycle) => ({
  ...cycle,
  official: cycle.items.some(({ official }) => official)
});

const process = ({ data: packs }, { data: cycles }) => {
  const packsData = packs
    .filter(removeUnusedPacks)
    .map(({ name, code, cycle_code, date_release }) => ({
      code,
      name,
      cycle: cycle_code,
      official: isOfficalPack(date_release)
    }));

  const emptyCycles = cycles.map(({ name, code, rotated }) => ({ name, code, items: [], rotated }));

  return packsData
    .reduce(addPacksIntoCycles, emptyCycles)
    .filter(removeCyclesWithNoPacks)
    .map(markCyclesAsOfficial);
};

module.exports = process;
