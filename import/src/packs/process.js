/* eslint-disable camelcase */
const additionalFields = (cycle) => ({ ...cycle, items: [] });

const correctCycleFor =
  ({ cycle }) =>
  ({ code }) =>
    code === cycle;

const packsIntoCycles = (cycles, pack) => {
  cycles.find(correctCycleFor(pack)).items.push(pack);
  return cycles;
};

const officialPacks = ({ date_release }) => date_release < "2018-09-07";

const includedCycles = ({ items }) => items.length;

const process = ({ data: packs }, { data: cycles }) =>
  packs
    .filter(officialPacks)
    .map(({ name, code, cycle_code }) => ({
      code,
      name,
      cycle: cycle_code,
    }))
    .reduce(packsIntoCycles, cycles.map(additionalFields))
    .filter(includedCycles)
    .map(({ name, code, items }) => ({
      name,
      code,
      items,
    }));

module.exports = process;
