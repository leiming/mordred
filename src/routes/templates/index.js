import Router from 'koa-router'
import fse from 'fs-extra'
import glob from 'glob'
import process from 'process'
import path from 'path'

const packagesPath = path.resolve(process.cwd(), 'packages')

const getPackages = () => glob.sync('**/package.json', {
  cwd: packagesPath
})

export const template = app => {

  const router = new Router({
    prefix: '/templates'
  })

  router.get('/', async(ctx, next) => {
    const files = await getPackages()
    // TODO: readFile
    if (files.length) {
      const packages = files.map(file => {
        return fse.readJSONSync(path.resolve(packagesPath, file), 'utf-8')
      })
      ctx.body = packages
    }
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
}

export default template
