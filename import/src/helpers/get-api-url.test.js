const apiUrl = require('./get-api-url');

describe('api-url', () => {
  it('prepends NRDB to a path segment', () => {
    const result = apiUrl('/foo');

    expect(result).toEqual('https://netrunnerdb.com/api/2.0/public/foo');
  });
});
