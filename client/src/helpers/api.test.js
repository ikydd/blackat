const { call } = require('./api')

describe('ApiCall', () => {

    // TODO: change this to use nock and test an actual mock backend
    // instead of a library implementation

    let mockSuccessResponse = {};

    beforeEach(() => {
        const mockJsonPromise = async () => Promise.resolve(mockSuccessResponse);
        const mockFetchPromise = ()=> Promise.resolve({ 
            json: mockJsonPromise
        });
        global.fetch = jest.fn().mockImplementation(mockFetchPromise);
    });

    afterEach(() => {
        global.fetch.mockClear();
        delete global.fetch;
    })

    it('calls the correct URL on the api', async () => {
        await call('/foo');
        
        expect(global.fetch).toHaveBeenCalledWith('/api/foo');
    });

    it('returns the payload', async () => {
        mockSuccessResponse = {
            foo: 'bar'
        }
        const data = await call('/foo')
        
        expect(data).toEqual(mockSuccessResponse);
    });
})