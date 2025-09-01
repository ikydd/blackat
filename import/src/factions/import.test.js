const request = require('../helpers/request');
const save = require('../helpers/save-file');
const apiUrl = require('../helpers/get-api-url');
const localPath = require('../helpers/get-local-path');
const process = require('./process');
const schema = require('../../schema/factions');
const factions = require('./import');

jest.mock('../helpers/request');
jest.mock('../helpers/save-file');
jest.mock('./process');
jest.mock('./process');
jest.mock('../../schema/factions');
jest.mock('../helpers/get-api-url');
jest.mock('../helpers/get-local-path');

const mockUrl = 'https://foo.co.uk/bar';
const mockPath = './test/foo/bar/file.json';

const mockData = {
  foo: 'bar'
};

const mockProcessedData = {
  bar: 'foo'
};

describe('main', () => {
  beforeEach(() => {
    request.mockClear();
    save.mockClear();
    process.mockClear();
    apiUrl.mockClear();
    localPath.mockClear();

    apiUrl.mockImplementation(() => mockUrl);
    request.mockImplementation(() => Promise.resolve(mockData));
    localPath.mockImplementation(() => mockPath);
    process.mockImplementation(() => mockProcessedData);
    save.mockImplementation(() => Promise.resolve());
    schema.mockImplementation(() => ({
      $schema: 'http://json-schema.org/draft-07/schema',
      type: 'object',
      required: ['foo'],
      properties: { foo: { type: 'string' } }
    }));
  });

  it('gets the NRDB factions endpoint', async () => {
    await factions();

    expect(apiUrl).toHaveBeenCalledWith('/factions');
  });

  it('calls the NRDB endpoint', async () => {
    await factions();

    expect(request).toHaveBeenCalledWith(mockUrl);
  });

  it('applies the processor', async () => {
    await factions();

    expect(process).toHaveBeenCalledWith(mockData);
  });

  it('gets the local save path', async () => {
    await factions();

    expect(localPath).toHaveBeenCalledWith('factions.json');
  });

  it('saves the processed data', async () => {
    await factions();

    expect(save).toHaveBeenCalledWith(mockProcessedData, mockPath);
  });

  it('errors when factions data does not match schema', async () => {
    const badData = {
      xxx: 'bar'
    };

    request.mockImplementation(() => Promise.resolve(badData));
    await expect(() => factions()).rejects.toThrow();
  });
});
