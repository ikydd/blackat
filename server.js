const { createReadStream } = require('fs');
const Koa = require('koa'); 
const KoaRouter = require('koa-router');
const serve = require('koa-static');
const path = require('path');
const port = process.env.PORT || 5000;

const app = new Koa(); 
const router = new KoaRouter();

router.get('/api/cards', (ctx) => {
    ctx.set('Content-Type', 'application/json');
    ctx.body = createReadStream(path.join(__dirname, 'api/cards.json'));
});

app
    .use(router.routes())
    .use(router.allowedMethods())

app.use(serve(path.join(__dirname, 'client/build'), {
    gzip: true
}));

const start = () => app.listen(port);

if (!module.parent) {
    start();
}

module.exports = {
    start
}