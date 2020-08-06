const process = require('./process');

const mockData = require('../../../fixtures/api/cards');

describe('process factions', () => {

    it('outputs the correct number of subtypes', () => {
        const output = process(mockData);

        expect(output.length).toEqual(7);
    });

    it('orders the subtypes alphabetically', () => {
        const output = process(mockData);

        expect(output.map(({ name }) => name)).toEqual([
            "AP",
            "Code Gate",
            "Decoder",
            "Icebreaker",
            "Initiative",
            "Sentry",
            "Trap"
        ]);
    });

    it('outputs the side code', () => {
        const output = process(mockData);

        expect(output.map(({ side }) => side)).toEqual([
            "corp",
            "corp",
            "runner",
            "runner",
            "corp",
            "corp",
            "corp"
        ]);
    });
})
