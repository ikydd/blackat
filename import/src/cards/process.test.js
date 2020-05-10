const process = require('./process');

const mockData = require('../../../fixtures/nrdb/cards');

describe('process cards', () => {

    it('outputs the same number of cards', () => {
        const output = process(mockData);

        expect(output.length).toEqual(mockData.data.length);
    });

    it('outputs the titles', () => {
        const output = process(mockData);

        expect(output[0].title).toEqual(mockData.data[0].title);
        expect(output[1].title).toEqual(mockData.data[1].title);
        expect(output[2].title).toEqual(mockData.data[2].title);
    });

    it('adds an image URL to each card using the template', () => {
        const output = process(mockData);

        expect(output[0].imagesrc).toEqual(mockData.imageUrlTemplate.replace('{code}', mockData.data[0].code));
        expect(output[1].imagesrc).toEqual(mockData.imageUrlTemplate.replace('{code}', mockData.data[1].code));
    });

    it('uses a specified image if present', () => {
        const output = process(mockData);

        expect(output[2].imagesrc).toEqual(mockData.data[2].image_url);
    });

    it('outputs the side', () => {
        const output = process(mockData);

        expect(output[2].side).toEqual(mockData.data[2].side_code);
        expect(output[3].side).toEqual(mockData.data[3].side_code);
    });

    it('outputs the card code', () => {
        const output = process(mockData);

        expect(output[0].code).toEqual(mockData.data[0].code);
        expect(output[1].code).toEqual(mockData.data[1].code);
        expect(output[2].code).toEqual(mockData.data[2].code);
        expect(output[3].code).toEqual(mockData.data[3].code);
    });
})
