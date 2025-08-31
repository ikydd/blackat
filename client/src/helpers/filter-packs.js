const isOfficial = (pack, official) => !official || pack.official;
const isNotRotated = (pack, rotated) => !rotated || !pack.rotated;

const filterPacks = (packs, { official = false, rotation = false }) =>
  packs.filter((pack) => isOfficial(pack, official) && isNotRotated(pack, rotation));

export default filterPacks;
