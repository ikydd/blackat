const process = require('./process');

const mockCardsData = require('../../../fixtures/nrdb/cards.json');
const mockPackData = require('../../../fixtures/api/packs.json');
const testCardsData = require('../../../fixtures/nrdb/cards-agendas.json');
const advancementCostTestCardsData = require('../../../fixtures/nrdb/cards-agendas.json');
const strengthTestCardsData = require('../../../fixtures/nrdb/cards-strength.json');
const subroutinesTestCardsData = require('../../../fixtures/nrdb/cards-subroutines.json');
const officialCardsData = require('../../../fixtures/nrdb/cards-official.json');
const bannedData = require('../../../fixtures/nrdb/banned.json');

describe('process cards', () => {
  it('outputs the correct number of cards', () => {
    const output = process(mockCardsData, mockPackData, bannedData);

    expect(output.length).toEqual(6);
  });

  it('does not output cards for not included packs', () => {
    const output = process(mockCardsData, mockPackData, bannedData);
    const cards = output.find((card) => card.title === 'The Shadow: Pulling the Strings');

    expect(cards).toBeFalsy();
  });

  it('outputs the titles', () => {
    const output = process(mockCardsData, mockPackData, bannedData);

    expect(output[0].title).toEqual(mockCardsData.data[0].title);
    expect(output[1].title).toEqual(mockCardsData.data[1].title);
    expect(output[2].title).toEqual(mockCardsData.data[2].title);
  });

  it('outputs the text', () => {
    const output = process(mockCardsData, mockPackData, bannedData);

    expect(output[0].text).toEqual(mockCardsData.data[0].text);
    expect(output[1].text).toEqual(mockCardsData.data[1].text);
    expect(output[2].text).toEqual(mockCardsData.data[2].text);
  });

  it('adds a text property even if the text is empty', () => {
    const output = process(mockCardsData, mockPackData, bannedData);
    const sunny = output.find((card) => card.title.includes('Sunny Lebeau'));

    expect(sunny).toHaveProperty('text');
    expect(sunny.text).toBe('');
  });

  it('adds an image URL to each card using the template', () => {
    const output = process(mockCardsData, mockPackData, bannedData);

    expect(output[0].imagesrc).toEqual(
      mockCardsData.imageUrlTemplate.replace('{code}', mockCardsData.data[0].code)
    );
    expect(output[1].imagesrc).toEqual(
      mockCardsData.imageUrlTemplate.replace('{code}', mockCardsData.data[1].code)
    );
  });

  it('uses a specified image if present', () => {
    const output = process(mockCardsData, mockPackData, bannedData);

    expect(output[2].imagesrc).toEqual(mockCardsData.data[2].image_url);
  });

  it('outputs the side', () => {
    const output = process(mockCardsData, mockPackData, bannedData);

    expect(output[2].side).toEqual(mockCardsData.data[2].side_code);
    expect(output[3].side).toEqual(mockCardsData.data[3].side_code);
  });

  it('outputs the card code', () => {
    const output = process(mockCardsData, mockPackData, bannedData);

    expect(output[0].code).toEqual(mockCardsData.data[0].code);
    expect(output[1].code).toEqual(mockCardsData.data[1].code);
    expect(output[2].code).toEqual(mockCardsData.data[2].code);
    expect(output[3].code).toEqual(mockCardsData.data[3].code);
  });

  it('outputs the faction code', () => {
    const output = process(mockCardsData, mockPackData, bannedData);

    expect(output[0].faction).toEqual(mockCardsData.data[0].faction_code);
    expect(output[1].faction).toEqual(mockCardsData.data[1].faction_code);
    expect(output[2].faction).toEqual(mockCardsData.data[2].faction_code);
    expect(output[3].faction).toEqual(mockCardsData.data[3].faction_code);
  });

  it('outputs the type code', () => {
    const output = process(mockCardsData, mockPackData, bannedData);

    expect(output[0].type).toEqual(mockCardsData.data[0].type_code);
    expect(output[1].type).toEqual(mockCardsData.data[1].type_code);
    expect(output[2].type).toEqual(mockCardsData.data[2].type_code);
    expect(output[3].type).toEqual(mockCardsData.data[3].type_code);
  });

  it('outputs the pack code', () => {
    const output = process(mockCardsData, mockPackData, bannedData);

    expect(output[0].pack).toEqual(mockCardsData.data[0].pack_code);
    expect(output[1].pack).toEqual(mockCardsData.data[1].pack_code);
    expect(output[2].pack).toEqual(mockCardsData.data[2].pack_code);
    expect(output[3].pack).toEqual(mockCardsData.data[3].pack_code);
  });

  it('outputs the keywords', () => {
    const output = process(mockCardsData, mockPackData, bannedData);

    expect(output[0].keywords).toEqual(mockCardsData.data[0].keywords);
    expect(output[1].keywords).toEqual(mockCardsData.data[1].keywords);
    expect(output[2].keywords).toEqual(mockCardsData.data[2].keywords);
    expect(output[3].keywords).toEqual(mockCardsData.data[3].keywords);
  });

  it('outputs the agenda points', () => {
    const output = process(testCardsData, mockPackData, bannedData);

    expect(output[0].agenda).toEqual(undefined);
    expect(output[1].agenda).toEqual(2);
    expect(output[2].agenda).toEqual(2);
    expect(output[3].agenda).toEqual(2);
  });

  it('outputs the advancement cost', () => {
    const output = process(advancementCostTestCardsData, mockPackData, bannedData);

    expect(output[0].advancement).toEqual(undefined);
    expect(output[1].advancement).toEqual(3);
    expect(output[2].advancement).toEqual(4);
    expect(output[3].advancement).toEqual(3);
  });

  it('outputs the strength', () => {
    const output = process(strengthTestCardsData, mockPackData, bannedData);

    expect(output[0].strength).toEqual(2);
    expect(output[1].strength).toEqual(undefined);
    expect(output[2].strength).toEqual(5);
    expect(output[3].strength).toEqual('X');
  });

  it('outputs the cost', () => {
    const output = process(mockCardsData, mockPackData, bannedData);

    expect(output[0].cost).toEqual(mockCardsData.data[0].cost);
    expect(output[1].cost).toEqual(mockCardsData.data[1].cost);
    expect(output[2].cost).toEqual(mockCardsData.data[2].cost);
    expect(output[3].cost).toEqual('X');
  });

  it('outputs the illustrator', () => {
    const output = process(mockCardsData, mockPackData, bannedData);

    expect(output[0].illustrator).toEqual(mockCardsData.data[0].illustrator);
    expect(output[1].illustrator).toEqual(mockCardsData.data[1].illustrator);
    expect(output[2].illustrator).toEqual(mockCardsData.data[2].illustrator);
    expect(output[3].illustrator).toEqual(mockCardsData.data[3].illustrator);
  });

  it('outputs the number of subroutines', () => {
    const output = process(subroutinesTestCardsData, mockPackData, bannedData);

    expect(output[0].subroutines).toEqual(undefined);
    expect(output[1].subroutines).toEqual(3);
    expect(output[2].subroutines).toEqual(3);
    expect(output[3].subroutines).toEqual(2);
    expect(output[4].subroutines).toEqual('X');
    expect(output[5].subroutines).toEqual(0);
    expect(output[6].subroutines).toEqual(1);
  });

  it('outputs the officialness', () => {
    const output = process(officialCardsData, mockPackData, bannedData);

    expect(output[0].official).toBeTruthy();
    expect(output[1].official).toBeFalsy();
  });

  it('outputs the rotatedness', () => {
    const output = process(officialCardsData, mockPackData, bannedData);

    expect(output[0].rotated).toBeTruthy();
    expect(output[1].rotated).toBeFalsy();
  });

  it('outputs the bannedness', () => {
    const output = process(mockCardsData, mockPackData, bannedData);

    expect(output[0].banned).toBeTruthy();
    expect(output[1].banned).toBeTruthy();
    expect(output[2].banned).toBeFalsy();
    expect(output[3].banned).toBeTruthy();
    expect(output[4].banned).toBeFalsy();
    expect(output[5].banned).toBeFalsy();
  });
});
