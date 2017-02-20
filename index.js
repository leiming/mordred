import Koa from 'koa'
const app = new Koa()
const port = 7777;

app.use(async function (ctx, next) {
  console.log('>> one');
  await next();
  console.log('<< one');
});

app.listen(port)
console.log(`\nhttp://localhost:${port}/\n`)
