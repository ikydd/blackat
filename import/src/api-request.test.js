const nock = require("nock");
const apiRequest = require("./api-request");

describe("api-request", () => {
  it("errors if you do not pass it an API URL", async () => {
    await expect(apiRequest()).rejects.toThrow(
      "An API base URL is required in api-request"
    );
  });

  it("calls a url on the source api", async () => {
    const testResponse = "Test response";
    nock("http://foo.co.uk").get("/bar").reply(200, testResponse);

    const response = await apiRequest("http://foo.co.uk/bar");

    expect(response).toEqual(testResponse);
  });
});
