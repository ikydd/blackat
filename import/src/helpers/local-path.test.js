const path = require("path");
const dataPath = require("./local-path");

describe("data-path", () => {
  it("prepends the appropriate path", () => {
    const result = dataPath("/foo.json");

    expect(result).toEqual(
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "client",
        "public",
        "data",
        "foo.json"
      )
    );
  });
});
