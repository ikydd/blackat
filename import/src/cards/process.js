const includedCards = (cycles) => {
    const packs = cycles.reduce((list, { items }) => list.concat(items), []);
    return ({ pack_code }) => packs.find(({ code }) => code === pack_code)
}

const process = ({ imageUrlTemplate, data: cards }, cycles) => cards
    .filter(includedCards(cycles))
    .map(({ title, text, code, image_url, side_code, faction_code, type_code, pack_code, keywords }) => ({
        code,
        title,
        text: text || '',
        imagesrc: image_url || imageUrlTemplate.replace('{code}', code),
        side: side_code,
        faction: faction_code,
        type: type_code,
        pack: pack_code,
        keywords
    }));

module.exports = process
