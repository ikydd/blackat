const handler = require('./cards').handler;

const mockData = {
    "imageUrlTemplate": "https://netrunnerdb.com/card_image/{code}.png",
    "data": [
      {
        title: "Medium",
        code: "01010"
      },
      {
        title: "Gordian Blade",
        code: "01043"
      },
      {
        title: "HQ Interface",
        code: "01010",
        imagesrc: "http://www.cardgamedb.com/forums/uploads/an/med_ADN49_26.png"
      }
    ]
};

describe('cards handler', () => {

    it('returns the cards', () => {
        const output = handler(mockData);

        expect(output[0].title).toEqual(mockData.data[0].title);
        expect(output[1].title).toEqual(mockData.data[1].title);
        expect(output[2].title).toEqual(mockData.data[2].title);
    });

    it('adds an image URL to each card', () => {
        const output = handler(mockData);

        expect(output[0].imagesrc).toEqual(`https://netrunnerdb.com/card_image/${mockData.data[0].code}.png`);
        expect(output[1].imagesrc).toEqual(`https://netrunnerdb.com/card_image/${mockData.data[1].code}.png`);
    });

    it('adds leaves a custom image if already present', () => {
        const output = handler(mockData);

        expect(output[2].imagesrc).toEqual(mockData.data[2].imagesrc);
    });
})
