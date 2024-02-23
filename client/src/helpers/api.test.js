const { getData } = require('./api');

describe('ApiCall', () => {
  let mockSuccessResponse = {};

  beforeEach(() => {
    const mockJsonPromise = async () => Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = () =>
      Promise.resolve({
        json: mockJsonPromise
      });
    global.fetch = jest.fn().mockImplementation(mockFetchPromise);
  });

  afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('calls the correct URL on the api', async () => {
    await getData('foo');

    expect(global.fetch).toHaveBeenCalledWith(
      '/data/foo.json',
      expect.any(Object)
    );
  });

  it('request the data gzipped', async () => {
    await getData('foo');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ headers: { 'Accept-Encoding': 'gzip' } })
    );
  });

  it('returns the payload', async () => {
    mockSuccessResponse = {
      foo: 'bar'
    };
    const data = await getData('foo');

    expect(data).toEqual(mockSuccessResponse);
  });
});
