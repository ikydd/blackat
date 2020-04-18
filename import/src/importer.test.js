const SourceApi = require('./source-api');
const Importer = require('./importer');

describe('Importer', () => {
    describe('cards', () => {
        it('calls the cards endpoint', () => {
            const mockData = {};
            const foo = new SourceApi();
            foo.call = jest.fn(() => mockData);
            const importer = new Importer(foo);
            importer.cards();

            expect(foo.call).toHaveBeenCalledWith('/cards');
        });

    });
})
