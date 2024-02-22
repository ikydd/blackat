const fs = require("fs-extra");
const save = require("./save");

describe("save", () => {
  const dir = `${__dirname}/tmp`;

  const setup = async () => {
    if (fs.existsSync(dir)) {
      await fs.emptyDir(dir);
      await fs.remove(dir);
    }
  };

  beforeEach(setup);
  afterEach(setup);

  it("errors if you do not pass in data", () => {
    expect(save(null, `${dir}/bar.json`)).rejects.toThrow(
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

    await save(mockData, `${dir}/bar.json`);

    const file = await fs.readFile(`${dir}/bar.json`, "utf-8");

    expect(file).toBe(JSON.stringify(mockData));
  });
});
