import Koa from 'koa'
const app = new Koa()
const port = 7777;
import transform from './app/routes/transform'
transform(app)

if (!module.parent) app.listen(port)
console.log(`\nhttp://localhost:${port}/\n`)
