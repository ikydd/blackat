const save = require("../helpers/save");
const localPath = require("../helpers/local-path");
const process = require("./process");
const subtypes = require("./import");

jest.mock("../helpers/save");
jest.mock("./process");
jest.mock("../helpers/local-path");

const mockPath = "./test/foo/bar/file.json";

const mockData = {
  foo: "bar",
};

const mockProcessedData = {
  bar: "foo",
};

describe("main", () => {
  beforeEach(() => {
    save.mockClear();
    process.mockClear();
    localPath.mockClear();

    localPath.mockImplementation(() => mockPath);
    process.mockImplementation(() => mockProcessedData);
    save.mockImplementation(() => Promise.resolve());
  });

  it("applies the processor", async () => {
    await subtypes(mockData);

    expect(process).toHaveBeenCalledWith(mockData);
  });

  it("gets the local save path", async () => {
    await subtypes(mockData);

    expect(localPath).toHaveBeenCalledWith("subtypes.json");
  });

  it("saves the processed data", async () => {
    await subtypes(mockData);

    expect(save).toHaveBeenCalledWith(mockProcessedData, mockPath);
  });
});
