/* eslint-disable camelcase */
const doesPackBelongToCycle = ({ cycle }, { code }) => code === cycle;

const addPacksIntoCycles = (cycles, pack) => {
  const matchingCycle = cycles.find((cycle) => doesPackBelongToCycle(pack, cycle));
  matchingCycle.items.push(pack);
  return cycles;
};

const officialPacksOnly = ({ date_release }) => date_release < '2018-09-07';

const removeCampaignPacks = ({ code }) => code !== 'tdc';

const removeCyclesWithNoPacks = ({ items }) => items.length;

const process = ({ data: packs }, { data: cycles }) => {
  const packsData = packs
    .filter(officialPacksOnly)
    .filter(removeCampaignPacks)
    .map(({ name, code, cycle_code }) => ({
      code,
      name,
      cycle: cycle_code
    }));

  const emptyCycles = cycles.map(({ name, code }) => ({ name, code, items: [] }));

  return packsData.reduce(addPacksIntoCycles, emptyCycles).filter(removeCyclesWithNoPacks);
};

module.exports = process;
