const apiUrl = require("./api-url");

describe("api-url", () => {
  it("prepends NRDB to a path segment", async () => {
    const result = await apiUrl("/foo");

    expect(result).toEqual("https://netrunnerdb.com/api/2.0/public/foo");
  });
});
