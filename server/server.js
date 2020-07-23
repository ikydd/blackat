const { createReadStream } = require("fs");
const Koa = require("koa");
const KoaRouter = require("koa-router");
const serve = require("koa-static");
const path = require("path");

const port = process.env.PORT || 5000;

const app = new Koa();
const router = new KoaRouter();

router.get("/status", (ctx) => {
  ctx.status = 200;
  ctx.body = "OK";
});

router.get("/api/cards", (ctx) => {
  ctx.set("Content-Type", "application/json");
  ctx.body = createReadStream(path.join(__dirname, "data", "cards.json"));
});

router.get("/api/factions", (ctx) => {
  ctx.set("Content-Type", "application/json");
  ctx.body = createReadStream(path.join(__dirname, "data", "factions.json"));
});

router.get("/api/types", (ctx) => {
  ctx.set("Content-Type", "application/json");
  ctx.body = createReadStream(path.join(__dirname, "data", "types.json"));
});

app.use(router.routes()).use(router.allowedMethods());

app.use(
  serve(path.join(__dirname, "..", "client", "build"), {
    gzip: true,
  })
);

if (!module.parent) {
  app.listen(port);
}

module.exports = {
  app,
};
