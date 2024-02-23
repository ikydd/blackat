const cards = require('./cards/import');
const factions = require('./factions/import');
const types = require('./types/import');
const packs = require('./packs/import');
const subtypes = require('./subtypes/import');
const mockPackData = require('../../fixtures/api/packs.json');
const mockCardData = require('../../fixtures/api/cards.json');

const main = require('./main');

jest.mock('./cards/import');
jest.mock('./factions/import');
jest.mock('./types/import');
jest.mock('./packs/import');
jest.mock('./subtypes/import');

describe('main', () => {
  beforeEach(() => {
    packs.mockImplementation(() => mockPackData);
    cards.mockImplementation(() => mockCardData);
  });

  it('calls cards', async () => {
    await main.run();

    expect(cards).toHaveBeenCalledWith(mockPackData);
  });

  it('calls factions', async () => {
    await main.run();

    expect(factions).toHaveBeenCalled();
  });

  it('calls types', async () => {
    await main.run();

    expect(types).toHaveBeenCalled();
  });

  it('calls packs', async () => {
    await main.run();

    expect(packs).toHaveBeenCalled();
  });

  it('calls subtypes', async () => {
    await main.run();

    expect(subtypes).toHaveBeenCalledWith(mockCardData);
  });
});
