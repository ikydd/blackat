const path = require("path");
const request = require("./request");
const save = require("./save");
const processCards = require("./processors/cards");
const cards = require("./cards");

jest.mock("./request");
jest.mock("./save");
jest.mock("./processors/cards");

const mockData = {
  foo: "bar",
};

const mockProcessedData = {
  bar: "foo",
};

describe("main", () => {
  beforeEach(() => {
    request.mockClear();
    save.mockClear();
    processCards.mockClear();

    request.mockImplementation(() => Promise.resolve(mockData));
    processCards.mockImplementation(() => mockProcessedData);
  });

  it("calls NRDB cards endpoint", async () => {
    await cards();

    expect(request).toHaveBeenCalledWith(
      "https://netrunnerdb.com/api/2.0/public/cards"
    );
  });

  it("applies the card processor", async () => {
    await cards();

    expect(processCards).toHaveBeenCalledWith(mockData);
  });

  it("saves the processed data", async () => {
    await cards();

    expect(save).toHaveBeenCalledWith(
      mockProcessedData,
      path.join(__dirname, "..", "..", "server", "data", "cards.json")
    );
  });
});
