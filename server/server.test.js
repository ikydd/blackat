const http = require("http");
const fs = require("fs");
const path = require("path");
const mock = require("mock-fs");
const { agent } = require("supertest");
const { app } = require("./server");

describe("server", () => {
  let request;
  let server;

  beforeEach(() => {
    server = http.createServer(app.callback());
    request = agent(server);
  });

  afterEach(() => {
    server.close();
  });

  describe("status", () => {
    it("return OK", () => {
      return request.get("/status").expect(200, "OK");
    });
  });

  describe("api", () => {
    const readDataFile = (dataType) =>
      fs.readFileSync(
        path.join(__dirname, "..", "fixtures", "api", `${dataType}.json`)
      );

    const endpoints = ["cards", "factions", "types", "packs"];

    afterEach(mock.restore);

    endpoints.forEach((endpoint) => {
      it(`return ${endpoint} data`, () => {
        const data = readDataFile(endpoint);

        // Workaround for mock-fs + jest breaking console log
        // console.log();
        mock({
          data: {
            [`${endpoint}.json`]: data,
          },
        });

        return request
          .get(`/api/${endpoint}`)
          .expect("Content-Type", /json/)
          .expect(200, JSON.parse(data));
      });
    });

    it("return not found for invalid URI segment", () => {
      return request.get("/api/foo").expect(404);
    });
  });
});
