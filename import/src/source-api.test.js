const nock = require("nock");
const SourceApi = require("./source-api");

describe("SourceApi", () => {
  it("errors if you do not pass it an API URL", () => {
    expect(() => new SourceApi()).toThrow(
      "An API base URL is required in the SourceAPI"
    );
  });

  it("calls a url on the source api", async () => {
    const testResponse = "Test response";
    nock("http://foo.co.uk").get("/bar").reply(200, testResponse);

    const foo = new SourceApi("http://foo.co.uk");
    const response = await foo.call("/bar");

    expect(response).toEqual(testResponse);
  });
});
