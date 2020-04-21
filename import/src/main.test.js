const cards = require("./cards/import");
const main = require("./main");

jest.mock("./cards/import");

describe("main", () => {
  it("calls cards", async () => {
    await main.run();

    expect(cards).toHaveBeenCalled();
  });
});
