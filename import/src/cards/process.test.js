const process = require('./process');

const mockCardsData = require('../../../fixtures/nrdb/cards');
const mockPackData = require('../../../fixtures/api/packs');

describe('process cards', () => {

    it('outputs the correct number of cards', () => {
        const output = process(mockCardsData, mockPackData);

        expect(output.length).toEqual(5);
    });

    it('does not output cards for not included packs', () => {
        const output = process(mockCardsData, mockPackData);
        const cards = output.find((card) => card.title === 'Border Control');

        expect(cards).toBeFalsy();
    });

    it('outputs the titles', () => {
        const output = process(mockCardsData, mockPackData);

        expect(output[0].title).toEqual(mockCardsData.data[0].title);
        expect(output[1].title).toEqual(mockCardsData.data[1].title);
        expect(output[2].title).toEqual(mockCardsData.data[2].title);
    });

    it('outputs the text', () => {
        const output = process(mockCardsData, mockPackData);

        expect(output[0].text).toEqual(mockCardsData.data[0].text);
        expect(output[1].text).toEqual(mockCardsData.data[1].text);
        expect(output[2].text).toEqual(mockCardsData.data[2].text);
    });

    it('adds a text property even if the text is empty', () => {
        const output = process(mockCardsData, mockPackData);
        const sunny = output.find((card) => card.title.includes('Sunny Lebeau'));

        expect(sunny).toHaveProperty('text');
        expect(sunny.text).toBe('');
    });

    it('adds an image URL to each card using the template', () => {
        const output = process(mockCardsData, mockPackData);

        expect(output[0].imagesrc).toEqual(mockCardsData.imageUrlTemplate.replace('{code}', mockCardsData.data[0].code));
        expect(output[1].imagesrc).toEqual(mockCardsData.imageUrlTemplate.replace('{code}', mockCardsData.data[1].code));
    });

    it('uses a specified image if present', () => {
        const output = process(mockCardsData, mockPackData);

        expect(output[2].imagesrc).toEqual(mockCardsData.data[2].image_url);
    });

    it('outputs the side', () => {
        const output = process(mockCardsData, mockPackData);

        expect(output[2].side).toEqual(mockCardsData.data[2].side_code);
        expect(output[3].side).toEqual(mockCardsData.data[3].side_code);
    });

    it('outputs the card code', () => {
        const output = process(mockCardsData, mockPackData);

        expect(output[0].code).toEqual(mockCardsData.data[0].code);
        expect(output[1].code).toEqual(mockCardsData.data[1].code);
        expect(output[2].code).toEqual(mockCardsData.data[2].code);
        expect(output[3].code).toEqual(mockCardsData.data[3].code);
    });

    it('outputs the faction code', () => {
        const output = process(mockCardsData, mockPackData);

        expect(output[0].faction).toEqual(mockCardsData.data[0].faction_code);
        expect(output[1].faction).toEqual(mockCardsData.data[1].faction_code);
        expect(output[2].faction).toEqual(mockCardsData.data[2].faction_code);
        expect(output[3].faction).toEqual(mockCardsData.data[3].faction_code);
    });

    it('outputs the type code', () => {
        const output = process(mockCardsData, mockPackData);

        expect(output[0].type).toEqual(mockCardsData.data[0].type_code);
        expect(output[1].type).toEqual(mockCardsData.data[1].type_code);
        expect(output[2].type).toEqual(mockCardsData.data[2].type_code);
        expect(output[3].type).toEqual(mockCardsData.data[3].type_code);
    });

    it('outputs the pack code', () => {
        const output = process(mockCardsData, mockPackData);

        expect(output[0].pack).toEqual(mockCardsData.data[0].pack_code);
        expect(output[1].pack).toEqual(mockCardsData.data[1].pack_code);
        expect(output[2].pack).toEqual(mockCardsData.data[2].pack_code);
        expect(output[3].pack).toEqual(mockCardsData.data[3].pack_code);
    });

    it('outputs the keywords', () => {
        const output = process(mockCardsData, mockPackData);

        expect(output[0].keywords).toEqual(mockCardsData.data[0].keywords);
        expect(output[1].keywords).toEqual(mockCardsData.data[1].keywords);
        expect(output[2].keywords).toEqual(mockCardsData.data[2].keywords);
        expect(output[3].keywords).toEqual(mockCardsData.data[3].keywords);
    });

    it('outputs the agenda points', () => {
        const testCardsData = require('../../../fixtures/nrdb/cards-agendas');
        const output = process(testCardsData, mockPackData);

        expect(output[0].agenda).toEqual(undefined);
        expect(output[1].agenda).toEqual(2);
        expect(output[2].agenda).toEqual(2);
        expect(output[3].agenda).toEqual(2);
    });

    it('outputs the advancement cost', () => {
        const testCardsData = require('../../../fixtures/nrdb/cards-agendas');
        const output = process(testCardsData, mockPackData);

        expect(output[0].advancement).toEqual(undefined);
        expect(output[1].advancement).toEqual(3);
        expect(output[2].advancement).toEqual(4);
        expect(output[3].advancement).toEqual(3);
    });

    it('outputs the strength', () => {
        const testCardsData = require('../../../fixtures/nrdb/cards-strength');
        const output = process(testCardsData, mockPackData);

        expect(output[0].strength).toEqual(2);
        expect(output[1].strength).toEqual(undefined);
        expect(output[2].strength).toEqual(5);
        expect(output[3].strength).toEqual(9999);
    });

    it('outputs the cost', () => {
        const output = process(mockCardsData, mockPackData);

        expect(output[0].cost).toEqual(mockCardsData.data[0].cost);
        expect(output[1].cost).toEqual(mockCardsData.data[1].cost);
        expect(output[2].cost).toEqual(mockCardsData.data[2].cost);
        expect(output[3].cost).toEqual(9999);
    });

    it('outputs the illustrator', () => {
        const output = process(mockCardsData, mockPackData);

        expect(output[0].illustrator).toEqual(mockCardsData.data[0].illustrator);
        expect(output[1].illustrator).toEqual(mockCardsData.data[1].illustrator);
        expect(output[2].illustrator).toEqual(mockCardsData.data[2].illustrator);
        expect(output[3].illustrator).toEqual(mockCardsData.data[3].illustrator);
    });

    it('outputs the number of subroutines', () => {
        const testCardsData = require('../../../fixtures/nrdb/cards-subroutines');
        const output = process(testCardsData, mockPackData);

        expect(output[0].subroutines).toEqual(undefined);
        expect(output[1].subroutines).toEqual(3);
        expect(output[2].subroutines).toEqual(3);
        expect(output[3].subroutines).toEqual(2);
        expect(output[4].subroutines).toEqual(9999);
        expect(output[5].subroutines).toEqual(0);
        expect(output[6].subroutines).toEqual(1);
    });
})
