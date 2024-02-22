const process = require("./process");
const mockData = require("../../../fixtures/api/subtypes-cards.json");
const mockDataSides = require("../../../fixtures/api/subtypes-cards-sides.json");
const mockDataDualSide = require("../../../fixtures/api/subtypes-cards-dualside.json");

describe("process factions", () => {
  it("outputs the correct number of subtypes", () => {
    const output = process(mockData);

    expect(output.length).toEqual(4);
  });

  it("gives each subtype a code", () => {
    const output = process(mockData);

    expect(output.map(({ code }) => code)).toEqual([
      "AP",
      "Code Gate",
      "Sentry",
      "Trap",
    ]);
  });

  it("orders the subtypes alphabetically", () => {
    const output = process(mockDataSides);

    expect(output.map(({ name }) => name)).toEqual([
      "AP",
      "Code Gate",
      "Sentry",
      "Trap",
    ]);
  });

  it("outputs the side code", () => {
    const output = process(mockDataDualSide);

    expect(output.map(({ side }) => side)).toEqual([
      "corp",
      "runner",
      "runner",
      "corp",
    ]);
  });

  it("outputs null when a subtype is for both sides", () => {
    const output = process(mockData);

    expect(output[0].side).toBeNull();
  });
});
