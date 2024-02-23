const nock = require('nock');
const request = require('./request');

describe('request', () => {
  it('errors if you do not pass it an API URL', async () => {
    await expect(request()).rejects.toThrow('A URL is required in request');
  });

  it('calls a url on the source api', async () => {
    const testResponse = 'Test response';
    nock('http://foo.co.uk').get('/bar').reply(200, testResponse);

    const response = await request('http://foo.co.uk/bar');

    expect(response).toEqual(testResponse);
  });

  it('throws an error if the response is not a 200', async () => {
    const testResponse = 'Test response';
    nock('http://foo.co.uk').get('/bar').reply(201, testResponse);

    await expect(request('http://foo.co.uk/bar')).rejects.toThrow();
  });
});
