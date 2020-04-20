const handler = ({ imageUrlTemplate, data: cards }) => {
    return cards.map(({ title, code, image_url }) => {
        return {
            title,
            imagesrc: image_url || imageUrlTemplate.replace('{code}', code)
        }
    });
}

module.exports = handler
