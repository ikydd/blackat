const process = ({ imageUrlTemplate, data: cards }, packs) => cards
    .filter(({ pack_code }) => packs.find(({ code }) => code === pack_code))
    .map(({ title, code, image_url, side_code, faction_code, type_code, pack_code }) => ({
        code,
        title,
        imagesrc: image_url || imageUrlTemplate.replace('{code}', code),
        side: side_code,
        faction: faction_code,
        type: type_code,
        pack: pack_code
    }));

module.exports = process
