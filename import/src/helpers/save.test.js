const fs = require("fs");
const save = require("./save");

jest.mock("fs");

describe("save", () => {
  beforeEach(() => {
    fs.writeFile.mockImplementation((path, data, callback) => callback());
  });

  afterEach(() => {
    fs.writeFile.mockReset();
  });

  it("errors if you do not pass in data", () => {
    expect(save(null, "./test/bar.json")).rejects.toThrow(
      "Some data is required to save"
    );
  });

  it("errors if you do not pass in a file path", () => {
    const mockData = {};

    expect(save(mockData)).rejects.toThrow(
      "A file path is required to save data"
    );
  });

  it("saves to the requested path", async () => {
    const mockData = { foo: "bar" };

    await save(mockData, "./test/bar.json");

    expect(fs.writeFile).toHaveBeenCalledWith(
      "./test/bar.json",
      JSON.stringify(mockData),
      expect.any(Function)
    );
  });
});
