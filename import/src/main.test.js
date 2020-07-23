const cards = require("./cards/import");
const factions = require("./factions/import");
const main = require("./main");

jest.mock("./cards/import");
jest.mock("./factions/import");

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

    expect(factions).toHaveBeenCalled();
  });
});
