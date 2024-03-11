const process = require('./process');

const mockPacks = require('../../../fixtures/nrdb/packs.json');
const mockCycles = require('../../../fixtures/nrdb/cycles.json');

describe('process factions', () => {
  it('outputs the correct number of cycles', () => {
    const output = process(mockPacks, mockCycles);

    expect(output.length).toEqual(8);
  });

  it('outputs the correct number of packs', () => {
    const output = process(mockPacks, mockCycles);

    expect(output[0].items.length).toEqual(1);
    expect(output[1].items.length).toEqual(6);
    expect(output[2].items.length).toEqual(1);
    expect(output[3].items.length).toEqual(6);
    expect(output[4].items.length).toEqual(1);
  });

  it('outputs the names of the cycles', () => {
    const output = process(mockPacks, mockCycles);

    expect(output[0].name).toEqual(mockCycles.data[0].name);
    expect(output[1].name).toEqual(mockCycles.data[1].name);
    expect(output[2].name).toEqual(mockCycles.data[2].name);
  });

  it('outputs the names of the packs', () => {
    const output = process(mockPacks, mockCycles);

    expect(output[0].items[0].name).toEqual(mockPacks.data[0].name);
    expect(output[1].items[0].name).toEqual(mockPacks.data[1].name);
    expect(output[1].items[1].name).toEqual(mockPacks.data[2].name);
  });

  it('outputs the cycle code', () => {
    const output = process(mockPacks, mockCycles);

    expect(output[0].code).toEqual(mockCycles.data[0].code);
    expect(output[1].code).toEqual(mockCycles.data[1].code);
    expect(output[2].code).toEqual(mockCycles.data[2].code);
    expect(output[3].code).toEqual(mockCycles.data[3].code);
  });

  it('outputs the pack code', () => {
    const output = process(mockPacks, mockCycles);

    expect(output[0].items[0].code).toEqual(mockPacks.data[0].code);
    expect(output[1].items[0].code).toEqual(mockPacks.data[1].code);
    expect(output[1].items[1].code).toEqual(mockPacks.data[2].code);
    expect(output[1].items[2].code).toEqual(mockPacks.data[3].code);
  });

  it('marks official ffg retail packs and cycles', () => {
    const output = process(mockPacks, mockCycles);
    const honorProfit = output.find(({ code }) => code === 'honor-and-profit');
    const magnumOpus = output.find(({ code }) => code === 'magnum-opus');
    const systemCore = output.find(({ code }) => code === 'sc19');

    expect(honorProfit.official).toBeTruthy();
    expect(honorProfit.items[0].official).toBeTruthy();
    expect(magnumOpus.official).toBeFalsy();
    expect(magnumOpus.items[0].official).toBeFalsy();
    expect(systemCore.official).toBeFalsy();
    expect(systemCore.items[0].official).toBeFalsy();
  });

  it('does not output draft packs', () => {
    const output = process(mockPacks, mockCycles);
    const cycle = output.find(({ code }) => code === 'draft');

    expect(cycle).toBeFalsy();
  });

  it('does not output packs from draft', () => {
    const output = process(mockPacks, mockCycles);
    const draft = output.find(({ code }) => code === 'draft');

    expect(draft).toBeFalsy();
  });

  it('does not output NAPD multiple pack', () => {
    const output = process(mockPacks, mockCycles);
    const napd = output.find(({ code }) => code === 'napd');

    expect(napd).toBeFalsy();
  });

  it('does not output campaign pack from terminal directive', () => {
    const output = process(mockPacks, mockCycles);
    const terminalDirective = output.find(({ code }) => code === 'terminal-directive');

    expect(terminalDirective.items).toHaveLength(1);
    expect(terminalDirective.items[0].code).toEqual('td');
  });
});
