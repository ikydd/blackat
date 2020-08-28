const includedCards = (cycles) => {
    const packs = cycles.reduce((list, { items }) => list.concat(items), []);
    return ({ pack_code }) => packs.find(({ code }) => code === pack_code)
}

const countSubroutines = (text) => {
    const subs = text.match(/\[subroutine\]/g);
    if (!subs) {
        return 0;
    }
    return text.match(/"\[subroutine\]/g) ? 'x' : subs.length;
}

const process = ({ imageUrlTemplate, data: cards }, cycles) => cards
    .filter(includedCards(cycles))
    .map(({ title, text, code, image_url, side_code, faction_code, type_code, pack_code,
            keywords, cost, strength, agenda_points, advancement_cost, trash_cost, illustrator }) => ({
        code,
        title,
        text: text || '',
        imagesrc: image_url || imageUrlTemplate.replace('{code}', code),
        side: side_code,
        faction: faction_code,
        type: type_code,
        pack: pack_code,
        keywords,
        cost: cost === null ? 9999 : cost,
        strength: strength === null ? 9999 : strength,
        trash: trash_cost,
        agenda: agenda_points,
        advancement: advancement_cost,
        illustrator,
        subroutines: type_code === 'ice' ? countSubroutines(text) : undefined
    }));

module.exports = process
