const request = require("../helpers/request");
const save = require("../helpers/save");
const apiUrl = require("../helpers/api-url");
const localPath = require("../helpers/local-path");
const process = require("./process");
const packs = require("./import");

jest.mock("../helpers/request");
jest.mock("../helpers/save");
jest.mock("./process");
jest.mock("../helpers/api-url");
jest.mock("../helpers/local-path");

const mockPacksUrl = 'https://foo.co.uk/packs';
const mockCyclesUrl = 'https://foo.co.uk/cycles';
const mockPath = './test/foo/bar/file.json';

const mockPacksData = {
  foo: "bar",
};

const mockCyclesData = {
  alpha: "bar",
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

    apiUrl.mockImplementation((type) => type === '/packs' ? mockPacksUrl : mockCyclesUrl );
    request.mockImplementation((url) => {
      const data = url === mockPacksUrl ? mockPacksData : mockCyclesData;
      return Promise.resolve(data)
    });
    localPath.mockImplementation(() => mockPath);
    process.mockImplementation(() => mockProcessedData);
    save.mockImplementation(() => Promise.resolve());
  });

  it("gets the NRDB packs endpoint", async () => {
    await packs();

    expect(apiUrl).toHaveBeenCalledWith('/packs');
  });

  it("calls the NRDB packs endpoint", async () => {
    await packs();

    expect(request).toHaveBeenCalledWith(mockPacksUrl);
  });

  it("gets the NRDB cycles endpoint", async () => {
    await packs();

    expect(apiUrl).toHaveBeenCalledWith('/cycles');
  });

  it("calls the NRDB cycles endpoint", async () => {
    await packs();

    expect(request).toHaveBeenCalledWith(mockCyclesUrl);
  });

  it("applies the processor", async () => {
    await packs();

    expect(process).toHaveBeenCalledWith(mockPacksData, mockCyclesData);
  });

  it("gets the local save path", async () => {
    await packs();

    expect(localPath).toHaveBeenCalledWith('packs.json');
  });

  it("saves the processed data", async () => {
    await packs();

    expect(save).toHaveBeenCalledWith(
      mockProcessedData,
      mockPath
    );
  });
});
