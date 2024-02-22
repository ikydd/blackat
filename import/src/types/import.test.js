const request = require("../helpers/request");
const save = require("../helpers/save");
const apiUrl = require("../helpers/api-url");
const localPath = require("../helpers/local-path");
const process = require("./process");
const types = require("./import");

jest.mock("../helpers/request");
jest.mock("../helpers/save");
jest.mock("./process");
jest.mock("../helpers/api-url");
jest.mock("../helpers/local-path");

const mockUrl = "https://foo.co.uk/bar";
const mockPath = "./test/foo/bar/file.json";

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
    apiUrl.mockClear();
    localPath.mockClear();

    apiUrl.mockImplementation(() => mockUrl);
    request.mockImplementation(() => Promise.resolve(mockData));
    localPath.mockImplementation(() => mockPath);
    process.mockImplementation(() => mockProcessedData);
    save.mockImplementation(() => Promise.resolve());
  });

  it("gets the NRDB types endpoint", async () => {
    await types();

    expect(apiUrl).toHaveBeenCalledWith("/types");
  });

  it("calls the NRDB endpoint", async () => {
    await types();

    expect(request).toHaveBeenCalledWith(mockUrl);
  });

  it("applies the processor", async () => {
    await types();

    expect(process).toHaveBeenCalledWith(mockData);
  });

  it("gets the local save path", async () => {
    await types();

    expect(localPath).toHaveBeenCalledWith("types.json");
  });

  it("saves the processed data", async () => {
    await types();

    expect(save).toHaveBeenCalledWith(mockProcessedData, mockPath);
  });
});
