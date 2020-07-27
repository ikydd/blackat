const { createReadStream } = require("fs");
const Koa = require("koa");
const KoaRouter = require("@koa/router");
const serve = require("koa-static");
const path = require("path");

const port = process.env.PORT || 5000;

const app = new Koa();
const router = new KoaRouter();

const getDataStream = (dataType) =>
  createReadStream(path.join(__dirname, "data", `${dataType}.json`));

const dataTypes = ["cards", "factions", "types", "packs"];
const isValidDataRequest = (request) => dataTypes.includes(request);

router.get("/status", (ctx) => {
  ctx.status = 200;
  ctx.body = "OK";
});

router.get("/api/:data", (ctx) => {
  const request = ctx.params.data;
  if (!isValidDataRequest(request)) {
    ctx.status = 404;
    ctx.set("Content-Type", "text/html");
    ctx.body = "Unrecognised data request";
    return;
  }
  ctx.set("Content-Type", "application/json");
  ctx.body = getDataStream(request);
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
