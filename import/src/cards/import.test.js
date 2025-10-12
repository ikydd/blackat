const fs = require('fs');
const path = require('path');
const request = require('../helpers/request');
const save = require('../helpers/save-file');
const apiUrl = require('../helpers/get-api-url');
const localPath = require('../helpers/get-local-path');
const process = require('./process');
const download = require('./download-images');
const cardsSchema = require('../../schema/cards');
const mwlSchema = require('../../schema/mwl');
const cards = require('./import');
const mockPackData = require('../../../fixtures/api/packs.json');

jest.mock('../helpers/request');
jest.mock('../helpers/save-file');
jest.mock('./process');
jest.mock('./download-images');
jest.mock('../../schema/cards');
jest.mock('../../schema/mwl');
jest.mock('../helpers/get-api-url');
jest.mock('../helpers/get-local-path');

const mockUrl = 'https://foo.co.uk/bar';
const mockPath = './test/foo/bar/file.json';

const mockCardsData = {
  foo: 'bar'
};

const mockMwlData = {
  alpha: 'beta'
};

const mockProcessedData = {
  bar: 'foo'
};

const mockFurtherProcessedData = {
  bar: 'far'
};

describe('main', () => {
  beforeEach(() => {
    request.mockClear();
    save.mockClear();
    process.mockClear();
    apiUrl.mockClear();
    localPath.mockClear();
    download.mockClear();

    apiUrl.mockImplementation((suffix) => `${mockUrl}${suffix}`);
    request.mockImplementation((url) => {
      const data = url === `${mockUrl}/cards` ? mockCardsData : mockMwlData;
      return Promise.resolve(data);
    });
    localPath.mockImplementation(() => mockPath);
    process.mockImplementation(() => mockProcessedData);
    save.mockImplementation(() => Promise.resolve());
    download.mockImplementation(() => Promise.resolve(mockFurtherProcessedData));
    cardsSchema.mockImplementation(() => ({
      $schema: 'http://json-schema.org/draft-07/schema',
      type: 'object',
      required: ['foo'],
      properties: { foo: { type: 'string' } }
    }));
    mwlSchema.mockImplementation(() => ({
      $schema: 'http://json-schema.org/draft-07/schema',
      type: 'object',
      required: ['alpha'],
      properties: { alpha: { type: 'string' } }
    }));
  });

  it('gets NRDB cards endpoint', async () => {
    await cards(mockPackData);

    expect(request).toHaveBeenCalledWith(`${mockUrl}/cards`);
  });

  it('gets NRDB MWL endpoint', async () => {
    await cards(mockPackData);

    expect(request).toHaveBeenCalledWith(`${mockUrl}/mwl`);
  });

  it('applies the processor', async () => {
    await cards(mockPackData);

    expect(process).toHaveBeenCalledWith(mockCardsData, mockPackData, mockMwlData);
  });

  it('downloads the images', async () => {
    const publicFolder = fs.realpathSync(`${__dirname}/../../../client/public`);
    const imgFolder = path.join(publicFolder, 'img', 'cards');

    await cards(mockPackData);

    expect(download).toHaveBeenCalledWith(imgFolder, mockProcessedData);
  });

  it('gets the local save path', async () => {
    await cards(mockPackData);

    expect(localPath).toHaveBeenCalledWith('cards.json');
  });

  it('saves the processed data', async () => {
    await cards(mockPackData);

    expect(save).toHaveBeenCalledWith(mockFurtherProcessedData, mockPath);
  });

  it('returns the list of cards', async () => {
    const output = await cards(mockPackData);

    expect(output).toEqual(mockFurtherProcessedData);
  });

  it('errors when cards data does not match schema', async () => {
    const badData = {
      xxx: 'bar'
    };

    request.mockImplementation((url) => {
      const data = url === `${mockUrl}/cards` ? badData : mockMwlData;
      return Promise.resolve(data);
    });
    await expect(() => cards(mockPackData)).rejects.toThrow();
  });

  it('errors when mwl data does not match schema', async () => {
    const badData = {
      xxx: 'bar'
    };

    request.mockImplementation((url) => {
      const data = url === `${mockUrl}/cards` ? mockCardsData : badData;
      return Promise.resolve(data);
    });
    await expect(() => cards(mockPackData)).rejects.toThrow();
  });
});
