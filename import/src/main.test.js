const path = require("path");
const SourceApi = require("./source-api");
const Importer = require("./importer");
const cardsHandler = require("./handlers/cards");
const main = require("./main");

jest.mock("./source-api");
jest.mock("./importer");

describe("main", () => {
  beforeEach(() => {
    SourceApi.mockClear();
    Importer.mockClear();
  });

  it("sets up a SourceApi with NRDB", async () => {
    await main.start();

    expect(SourceApi).toHaveBeenCalledWith(
      "https://netrunnerdb.com/api/2.0/public"
    );
  });

  it("sets up an Importer that targets the data folder", async () => {
    await main.start();

    expect(Importer).toHaveBeenCalledWith(
      expect.any(Object),
      path.join(__dirname, "..", "..", "server", "data")
    );
  });

  it("imports the cards", async () => {
    await main.start();

    expect(Importer.mock.instances[0].import).toHaveBeenCalledWith(
      "/cards",
      cardsHandler
    );
  });
});
