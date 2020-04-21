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
    const cards = fs.readFileSync(
      path.join(__dirname, "..", "fixtures", "api", "cards.json")
    );

    beforeEach(() => {
      mock({
        data: {
          "cards.json": cards,
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
  });
});
