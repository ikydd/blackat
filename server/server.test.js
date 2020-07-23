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

    const cards = readDataFile("cards");
    const factions = readDataFile("factions");
    const types = readDataFile("types");

    beforeEach(() => {
      // Workaround for mock-fs + jest breaking console log
      // console.log();
      mock({
        data: {
          "cards.json": cards,
          "factions.json": factions,
          "types.json": types,
        },
      });
    });

    afterEach(mock.restore);

    it("return cards data", () => {
      return request
        .get("/api/cards")
        .expect("Content-Type", /json/)
        .expect(200, JSON.parse(cards));
    });

    it("return factions data", () => {
      return request
        .get("/api/factions")
        .expect("Content-Type", /json/)
        .expect(200, JSON.parse(factions));
    });

    it("return types data", () => {
      return request
        .get("/api/types")
        .expect("Content-Type", /json/)
        .expect(200, JSON.parse(types));
    });

    it("return not found for invalid URI segment", () => {
      return request.get("/api/foo").expect(404);
    });
  });
});
