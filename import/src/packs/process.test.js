const process = require('./process');

const mockData = require('../../../fixtures/nrdb/packs');

describe('process factions', () => {

    it('outputs the correct number of packs', () => {
        const output = process(mockData);

        expect(output.length).toEqual(15);
    });

    it('outputs the names', () => {
        const output = process(mockData);

        expect(output[0].name).toEqual(mockData.data[0].name);
        expect(output[1].name).toEqual(mockData.data[1].name);
        expect(output[2].name).toEqual(mockData.data[2].name);
    });

    it('outputs the pack code', () => {
        const output = process(mockData);

        expect(output[0].code).toEqual(mockData.data[0].code);
        expect(output[1].code).toEqual(mockData.data[1].code);
        expect(output[2].code).toEqual(mockData.data[2].code);
        expect(output[3].code).toEqual(mockData.data[3].code);
    });

    it('does not output fan-made packs', () => {
        const output = process(mockData);
        const packs = output.find((pack) => pack.code === 'mo');

        expect(packs).toBeFalsy();
    });

    it('does not output draft packs', () => {
        const output = process(mockData);
        const packs = output.find((pack) => pack.code === 'draft');

        expect(packs).toBeFalsy();
    });
})
