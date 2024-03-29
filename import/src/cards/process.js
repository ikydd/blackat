/* eslint-disable camelcase */
const countSubroutines = (text) => {
  const hasSubs = text.match(/\[subroutine\]/g);
  if (!hasSubs) {
    return 0;
  }
  const subs = text.match(/(\n|^)\[subroutine\]/g);
  return subs ? subs.length : 'X';
};

const isOfficialCard = (pack_code, packs) => packs.find(({ code }) => code === pack_code).official;
const isRotatedCard = (pack_code, packs) => packs.find(({ code }) => code === pack_code).rotated;
const isBannedCard = (code, bannedCards) => bannedCards.some((id) => code === id);

const getBannedCards = (mwl) => {
  const active = mwl.find((banList) => banList.active);
  return Object.keys(active.cards);
};

const process = ({ imageUrlTemplate, data: cards }, cycles, { data: mwl }) => {
  const includedPacks = cycles.reduce((list, { items }) => list.concat(items), []);
  const keepCardsFromIncludedPacks = ({ pack_code }) =>
    includedPacks.some(({ code }) => code === pack_code);
  const bannedCards = getBannedCards(mwl);

  return cards
    .filter(keepCardsFromIncludedPacks)
    .map(
      ({
        title,
        text,
        code,
        image_url,
        side_code,
        faction_code,
        type_code,
        pack_code,
        keywords,
        cost,
        strength,
        agenda_points,
        advancement_cost,
        illustrator
      }) => {
        return {
          code,
          title,
          text: text || '',
          imagesrc: image_url || imageUrlTemplate.replace('{code}', code),
          side: side_code,
          faction: faction_code,
          type: type_code,
          pack: pack_code,
          keywords,
          cost: cost === null ? 'X' : cost,
          strength: strength === null ? 'X' : strength,
          agenda: agenda_points,
          advancement: advancement_cost,
          illustrator,
          subroutines: type_code === 'ice' ? countSubroutines(text) : undefined,
          official: isOfficialCard(pack_code, includedPacks),
          rotated: isRotatedCard(pack_code, includedPacks),
          banned: isBannedCard(code, bannedCards)
        };
      }
    );
};
module.exports = process;
