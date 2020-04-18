const fs = require("fs");
const SourceApi = require("./source-api");
const Importer = require("./importer");

jest.mock("fs");

describe("Importer", () => {
  beforeEach(() => {
    fs.writeFile.mockImplementation((path, data, callback) => callback());
  });

  afterEach(() => {
    fs.writeFile.mockReset();
  });

  describe("import", () => {
    it("errors if you do not pass in an API", () => {
      expect(() => new Importer(null, "./test/")).toThrow(
        "An API is required in the Importer"
      );
    });

    it("errors if you do not pass in a import directory", () => {
      const foo = new SourceApi("http://foo.co.uk");
      expect(() => new Importer(foo)).toThrow(
        "An import directory is required in the Importer"
      );
    });

    it("calls the requested endpoint", async () => {
      const mockData = {};

      const foo = new SourceApi("http://foo.co.uk");
      foo.call = jest.fn(() => Promise.resolve(mockData));

      const importer = new Importer(foo, "./test/");
      await importer.import("/bar");

      expect(foo.call).toHaveBeenCalledWith("/bar");
    });

    it("writes the data to a file", async () => {
      const mockData = { foo: "bar" };
      const importFolder = "test/";

      const foo = new SourceApi("http://foo.co.uk");
      foo.call = jest.fn(() => Promise.resolve(mockData));

      const importer = new Importer(foo, importFolder);
      await importer.import("/bar");

      expect(fs.writeFile).toHaveBeenCalledWith(
        `${importFolder}cards.json`,
        JSON.stringify(mockData),
        expect.any(Function)
      );
    });

    it("takes a custom process handler", async () => {
      const mockData = { foo: "bar" };
      const testValue = "another value";
      const importFolder = "test/";

      const foo = new SourceApi("http://foo.co.uk");
      foo.call = jest.fn(() => Promise.resolve(mockData));

      const importer = new Importer(foo, importFolder);
      await importer.import("/bar", () => {
        return {
          foo: testValue,
        };
      });

      expect(fs.writeFile).toHaveBeenCalledWith(
        `${importFolder}cards.json`,
        JSON.stringify({ foo: testValue }),
        expect.any(Function)
      );
    });
  });
});
