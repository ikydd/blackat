const process = ({ imageUrlTemplate, data: cards }) => cards
    .map(({ title, code, image_url, side_code, faction_code, type_code }) => ({
        code,
        title,
        imagesrc: image_url || imageUrlTemplate.replace('{code}', code),
        side: side_code,
        faction: faction_code,
        type: type_code
    }));

module.exports = process
