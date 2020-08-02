const process = require('./process');

const mockData = require('../../../fixtures/nrdb/types');

describe('process factions', () => {

    it('outputs the correct number of types', () => {
        const output = process(mockData);

        expect(output).toHaveLength(5);
    });

    it('orders the output', () => {
        const output = process(mockData)
            .map(({ code }) => code);

        expect(output).toEqual(['identity', 'program', 'event', 'agenda', 'ice']);
    });

    it('outputs the names', () => {
        const output = process(mockData);

        expect(output[0].name).toEqual("Identity");
        expect(output[1].name).toEqual("Program");
        expect(output[2].name).toEqual("Event");
    });

    it('outputs the side', () => {
        const output = process(mockData);

        expect(output[2].side).toEqual("runner");
        expect(output[3].side).toEqual("corp");
    });

    it('outputs empty side codes', () => {
        const output = process(mockData);
        const dualside = output.find((type) => type.code === 'identity');

        expect(dualside).toBeTruthy();
    });

    it('outputs the type code', () => {
        const output = process(mockData);

        expect(output[0].code).toEqual("identity");
        expect(output[1].code).toEqual("program");
        expect(output[2].code).toEqual("event");
        expect(output[3].code).toEqual("agenda");
    });

    it('does not output subtypes', () => {
        const output = process(mockData);
        const subtypes = output.find((type) => type.code === 'icebreaker');

        expect(subtypes).toBeFalsy();
    });
})
