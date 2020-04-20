const handler = ({ imageUrlTemplate, data: cards }) => cards.map(({ title, code, imagesrc }) => {
        const img = imagesrc || imageUrlTemplate.replace('{code}', code);
        return {
            title,
            imagesrc: img
        }
    });

module.exports = {
    handler
}
