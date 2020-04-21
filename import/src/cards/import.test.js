const path = require("path");
const request = require("../request");
const save = require("../save");
const process = require("./process");
const cards = require("./import");

jest.mock("../request");
jest.mock("../save");
jest.mock("./process");

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
    process.mockClear();

    request.mockImplementation(() => Promise.resolve(mockData));
    process.mockImplementation(() => mockProcessedData);
  });

  it("calls NRDB cards endpoint", async () => {
    await cards();

    expect(request).toHaveBeenCalledWith(
      "https://netrunnerdb.com/api/2.0/public/cards"
    );
  });

  it("applies the card processor", async () => {
    await cards();

    expect(process).toHaveBeenCalledWith(mockData);
  });

  it("saves the processed data", async () => {
    await cards();

    expect(save).toHaveBeenCalledWith(
      mockProcessedData,
      path.join(__dirname, "..", "..", "..", "server", "data", "cards.json")
    );
  });
});
