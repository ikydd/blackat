const cards = require("./cards/import");
const factions = require("./factions/import");
const types = require("./types/import");
const packs = require("./packs/import");
const main = require("./main");

jest.mock("./cards/import");
jest.mock("./factions/import");
jest.mock("./types/import");
jest.mock("./packs/import");

describe("main", () => {
  it("calls cards", async () => {
    await main.run();

    expect(cards).toHaveBeenCalled();
  });

  it("calls factions", async () => {
    await main.run();

    expect(factions).toHaveBeenCalled();
  });

  it("calls types", async () => {
    await main.run();

    expect(types).toHaveBeenCalled();
  });

  it("calls packs", async () => {
    await main.run();

    expect(packs).toHaveBeenCalled();
  });
});
