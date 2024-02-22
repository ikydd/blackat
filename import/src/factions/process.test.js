const process = require("./process");

const mockData = require("../../../fixtures/nrdb/factions.json");

describe("process factions", () => {
  it("outputs the same number of factions", () => {
    const output = process(mockData);

    expect(output).toHaveLength(mockData.data.length);
  });

  it("orders the factions alphabetically", () => {
    const output = process(mockData)
      .map(({ name }) => name)
      .slice(0, 5);

    expect(output).toEqual([
      "Adam",
      "Anarch",
      "Apex",
      "Criminal",
      "Haas-Bioroid",
    ]);
  });

  it("orders the neutral factions last", () => {
    const output = process(mockData)
      .map(({ name }) => name)
      .slice(-2);

    expect(output).toEqual(["Neutral", "Neutral"]);
  });

  it("outputs the names", () => {
    const output = process(mockData);

    expect(output[0].name).toEqual("Adam");
    expect(output[1].name).toEqual("Anarch");
    expect(output[2].name).toEqual("Apex");
  });

  it("outputs the side", () => {
    const output = process(mockData);

    expect(output[3].side).toEqual("runner");
    expect(output[4].side).toEqual("corp");
  });

  it("outputs the faction code", () => {
    const output = process(mockData);

    expect(output[0].code).toEqual("adam");
    expect(output[1].code).toEqual("anarch");
    expect(output[2].code).toEqual("apex");
    expect(output[3].code).toEqual("criminal");
  });
});
