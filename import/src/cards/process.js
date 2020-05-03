const process = ({ imageUrlTemplate, data: cards }) => {
    return cards.map(({ title, code, image_url, side_code }) => {
        return {
            title,
            imagesrc: image_url || imageUrlTemplate.replace('{code}', code),
            side: side_code
        }
    });
}

module.exports = process
