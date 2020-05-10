const nock = require('nock');
const download = require('./download-images');
const fsExtra = require('fs-extra');
const fs = require('fs');

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

    beforeEach(() => {

        if (fs.existsSync(dir)){
            fsExtra.emptyDirSync(dir);
        } else {
            fs.mkdirSync(dir);
        }
        console.error = jest.fn();
    });

    afterEach(() => {
        if (fs.existsSync(dir)){
            fsExtra.emptyDirSync(dir);
            fsExtra.removeSync(dir);
        }
        console.error = originalLog;
        nock.cleanAll()
    });

    it('saves the image of each card to a specified folder', async () => {
        nock.load(`${fixtures}/chum.json`);
        nock.load(`${fixtures}/dirty-laundry.json`);

        await download(dir, [chum, dirtyLaundry]);

        const files = fs.readdirSync(dir);
        expect(files).toEqual(['01075.png', '25060.png']);
    });

    it('handles cardgame db links', async () => {
        nock.load(`${fixtures}/eden-fragment.json`);

        await download(dir, [edenFragment]);

        const files = fs.readdirSync(dir);
        expect(files).toEqual(['06030.png']);
    });

    it('does not save the image if there already is a file in place', async () => {
        const testBody = new Array(100000).fill('test').join("");
        nock.load(`${fixtures}/chum.json`);
        fs.writeFileSync(`${dir}/01075.png`, testBody, 'utf8');

        await download(dir, [chum]);
        const data = fs.readFileSync(`${dir}/01075.png`, 'utf8');

        expect(data).toEqual(testBody);
    });

    it('does save the image if there already is a file but it is smaller than 100k', async () => {
        const testBody = 'test';
        nock.load(`${fixtures}/chum.json`);
        fs.writeFileSync(`${dir}/01075.png`, testBody, 'utf8');

        await download(dir, [chum]);
        const data = fs.readFileSync(`${dir}/01075.png`, 'utf8');

        expect(data).not.toEqual(testBody);
    });

    it('logs an error if there is a problem', async () => {
        nock('https://netrunnerdb.com')
            .get('/card_image/01075.png')
            .reply(500);

        await download(dir, [chum]);

        expect(console.error).toHaveBeenCalled();
    });
})
