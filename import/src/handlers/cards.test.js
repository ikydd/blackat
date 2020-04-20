const handler = require('./cards');

const mockData = {
    "imageUrlTemplate": "https://netrunnerdb.com/card_image/{code}.png",
    "data": [
      {
        name: "Account Siphon"
      }
    ]
};

describe('cards handler', () => {
    it('returns the data property', () => {
        const output = handler(mockData);

        expect(output).toEqual(mockData.data);
    });
})
