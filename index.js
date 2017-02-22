import Koa from 'koa'
const app = new Koa()
const port = 7777;
import transform from './app/routes/transform'
import templates from './app/routes/templates'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'
import cors from 'kcors'

app.use(cors())
app.use(serve('dist'))
app.use(bodyParser())

transform(app)

templates(app)

if (!module.parent) app.listen(port)
console.log(`\nhttp://localhost:${port}/\n`)
