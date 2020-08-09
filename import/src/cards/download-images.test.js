const nock = require('nock');
const download = require('./download-images');
const fs = require('fs-extra');

describe('download images', () => {

    const chum = {
        imagesrc: 'https://netrunnerdb.com/card_image/01075.png',
        code: '01075'
    };

    const dirtyLaundry = {
        imagesrc: 'https://netrunnerdb.com/card_image/25060.png',
        code: '25060'
    }

    const edenFragment = {
        imagesrc: 'http://www.cardgamedb.com/forums/uploads/an/med_ADN17_30.png',
        code: '06030'
    }

    const dir = `${__dirname}/tmp`;
    const fixtures = `${__dirname}/fixtures`;
    const originalLog = console.error;

    const setup = async () => {
      if (fs.existsSync(dir)){
          await fs.emptyDir(dir);
          await fs.remove(dir);
      }
    }

    beforeEach(async () => {
        await setup();
        console.error = jest.fn();
    });

    afterEach(async () => {
        await setup();
        console.error = originalLog;
        nock.cleanAll()
    });

    it('saves the image of each card to a specified folder', async () => {
        nock.load(`${fixtures}/chum.json`);
        nock.load(`${fixtures}/dirty-laundry.json`);

        await download(dir, [chum, dirtyLaundry]);

        const files = await fs.readdir(dir);
        expect(files).toEqual(['01075.png', '25060.png']);
    });

    it('handles cardgame db links', async () => {
        nock.load(`${fixtures}/eden-fragment.json`);

        await download(dir, [edenFragment]);

        const files = await fs.readdir(dir);
        expect(files).toEqual(['06030.png']);
    });

    it('does not save the image if there already is a file in place', async () => {
        const testBody = new Array(100000).fill('test').join("");
        nock.load(`${fixtures}/chum.json`);
        await fs.ensureDir(dir);
        await fs.writeFile(`${dir}/01075.png`, testBody, 'utf8');

        await download(dir, [chum]);
        const data = await fs.readFile(`${dir}/01075.png`, 'utf8');

        expect(data).toEqual(testBody);
    });

    it('does save the image if there already is a file but it is smaller than 200k', async () => {
        const testBody = 'test';
        nock.load(`${fixtures}/chum.json`);
        await fs.ensureDir(dir);
        await fs.writeFile(`${dir}/01075.png`, testBody, 'utf8');

        await download(dir, [chum]);
        const data = await fs.readFile(`${dir}/01075.png`, 'utf8');

        expect(data).not.toEqual(testBody);
    });

    it('logs an error if there is a problem', async () => {
        nock('https://netrunnerdb.com')
            .get('/card_image/01075.png')
            .reply(500);

        await download(dir, [chum]);

        expect(console.error).toHaveBeenCalled();
    });

    it('returns the card data after downloading', async () => {
        nock.load(`${fixtures}/chum.json`);
        nock.load(`${fixtures}/dirty-laundry.json`);

        const cards = await download(dir, [chum, dirtyLaundry]);

        expect(cards).toEqual([chum, dirtyLaundry]);
    });
})
