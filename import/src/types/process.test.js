const process = require('./process');

const mockData = require('../../../fixtures/nrdb/types');

describe('process factions', () => {

    it('outputs the correct number of types', () => {
        const output = process(mockData);

        expect(output.length).toEqual(5);
    });

    it('outputs the names', () => {
        const output = process(mockData);

        expect(output[0].name).toEqual(mockData.data[0].name);
        expect(output[1].name).toEqual(mockData.data[1].name);
        expect(output[2].name).toEqual(mockData.data[2].name);
    });

    it('outputs the side', () => {
        const output = process(mockData);

        expect(output[2].side).toEqual(mockData.data[2].side_code);
        expect(output[3].side).toEqual(mockData.data[3].side_code);
    });

    it('outputs empty side codes', () => {
        const output = process(mockData);
        const dualside = output.find((type) => type.code === 'identity');

        expect(dualside).toBeTruthy();
    });

    it('outputs the type code', () => {
        const output = process(mockData);

        expect(output[0].code).toEqual(mockData.data[0].code);
        expect(output[1].code).toEqual(mockData.data[1].code);
        expect(output[2].code).toEqual(mockData.data[2].code);
        expect(output[3].code).toEqual(mockData.data[3].code);
    });

    it('does not output subtypes', () => {
        const output = process(mockData);
        const subtypes = output.find((type) => type.code === 'icebreaker');

        expect(subtypes).toBeFalsy();
    });
})
