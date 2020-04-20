const handler = require('./cards');

const mockData = require('../../../fixtures/nrdb/cards');

describe('cards handler', () => {

    it('returns the cards', () => {
        const output = handler(mockData);

        expect(output[0].title).toEqual(mockData.data[0].title);
        expect(output[1].title).toEqual(mockData.data[1].title);
        expect(output[2].title).toEqual(mockData.data[2].title);
    });

    it('adds an image URL to each card using the template', () => {
        const output = handler(mockData);

        expect(output[0].imagesrc).toEqual(mockData.imageUrlTemplate.replace('{code}', mockData.data[0].code));
        expect(output[1].imagesrc).toEqual(mockData.imageUrlTemplate.replace('{code}', mockData.data[1].code));
    });

    it('uses a specified image if present', () => {
        const output = handler(mockData);

        expect(output[2].imagesrc).toEqual(mockData.data[2].image_url);
    });
})
