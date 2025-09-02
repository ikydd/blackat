const process = require('./process');
const save = require('../helpers/save-file');
const localPath = require('../helpers/get-local-path');

jest.mock('../helpers/save-file');
jest.mock('../helpers/get-local-path');

const mockPath = './test/foo/bar/file.json';

describe('process timestamp', () => {
  beforeEach(() => {
    save.mockClear();
    localPath.mockClear();
    localPath.mockImplementation(() => mockPath);
  });

  it('saves the time data', async () => {
    Object.defineProperty(global, 'performance', {
      writable: true
    });
    jest.useFakeTimers().setSystemTime(new Date(1756838018676));

    await process();

    expect(save).toHaveBeenCalledWith({ timestamp: 1756838018676 }, mockPath);
  });
});
