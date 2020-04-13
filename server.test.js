
const http = require('http');
const { agent } = require('supertest');
const { app } = require('./server');

describe("server", () => {

    let request;
    let server;

    beforeEach(() => {
        server = http.createServer(app.callback());
        request = agent(server);
    });

    afterEach(() => {
        server.close();
    })

    describe("status", () => {
        it("return OK", () => {
            return request
                .get('/status')
                .expect(200)
                .expect('OK');
        });
    });
});
