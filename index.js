import Koa from 'koa'
const app = new Koa()
const port = 7777;
import transform from './app/routes/transform'
import serve from 'koa-static'
transform(app)

app.use(serve('dist'))

if (!module.parent) app.listen(port)
console.log(`\nhttp://localhost:${port}/\n`)
