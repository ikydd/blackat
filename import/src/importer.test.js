const SourceApi = require('./source-api');
const Importer = require('./importer');
const fs = require('fs');

jest.mock('fs');

describe('Importer', () => {

    beforeEach(() => {
        fs.writeFile.mockImplementation((path, data, callback) => callback())
    })

    describe('import', () => {

        it('errors if you do not pass in an API', () => {
            expect(() => { new Importer(null, './test/'); }).toThrow('An API is required in the Importer');
        });

        it('errors if you do not pass in a import directory', () => {
            const foo = new SourceApi('http://foo.co.uk');
            expect(() => { new Importer(foo); }).toThrow('An import directory is required in the Importer');
        });

        it('calls the requested endpoint', async () => {
            const mockData = {};

            const foo = new SourceApi('http://foo.co.uk');
            foo.call = jest.fn(() => Promise.resolve(mockData));

            const importer = new Importer(foo, './test/');
            await importer.import('/bar');

            expect(foo.call).toHaveBeenCalledWith('/bar');
        });

        it('writes the data to a file', async () => {
            const mockData = { foo: 'bar' };
            const importFolder = 'test/';

            const foo = new SourceApi('http://foo.co.uk');
            foo.call = jest.fn(() => Promise.resolve(mockData));

            const importer = new Importer(foo, importFolder);
            await importer.import('/bar');

            expect(fs.writeFile).toHaveBeenCalledWith(`${importFolder}cards.json`, JSON.stringify(mockData), expect.any(Function));
        });
    });
})
