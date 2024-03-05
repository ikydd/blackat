const fs = require('fs');
const request = require('../helpers/request');
const save = require('../helpers/save-file');
const apiUrl = require('../helpers/get-api-url');
const localPath = require('../helpers/get-local-path');
const process = require('./process');
const download = require('./download-images');
const cards = require('./import');
const mockPackData = require('../../../fixtures/api/packs.json');

jest.mock('../helpers/request');
jest.mock('../helpers/save-file');
jest.mock('./process');
jest.mock('./download-images');
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

    apiUrl.mockImplementation(() => mockUrl);
    request.mockImplementation(() => Promise.resolve(mockData));
    localPath.mockImplementation(() => mockPath);
    process.mockImplementation(() => mockProcessedData);
    save.mockImplementation(() => Promise.resolve());
    download.mockImplementation(() => Promise.resolve(mockFurtherProcessedData));
  });

  it('gets NRDB cards endpoint', async () => {
    await cards(mockPackData);

    expect(apiUrl).toHaveBeenCalledWith('/cards');
  });

  it('calls the NRDB endpoint', async () => {
    await cards(mockPackData);

    expect(request).toHaveBeenCalledWith(mockUrl);
  });

  it('applies the processor', async () => {
    await cards(mockPackData);

    expect(process).toHaveBeenCalledWith(mockData, mockPackData);
  });

  it('downloads the images', async () => {
    const path = fs.realpathSync(`${__dirname}/../../../client/public/img/cards`);

    await cards(mockPackData);

    expect(download).toHaveBeenCalledWith(path, mockProcessedData);
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
});
