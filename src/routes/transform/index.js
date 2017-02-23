import Router from 'koa-router'
import fse from 'fs-extra'
import path from 'path'
import process from 'process'
import glob from 'glob'

const injectJavaScriptIntoHTML = (html, obj = {}) => {
  const headRegExp = /(<\/head>)/i;
  if (headRegExp.test(html)) {
    return html.replace(headRegExp, matched => {
      return `<script>\nvar obj = ${JSON.stringify(obj, null, 2)}\n</script>\n` + matched
    })
  } else {
    // TODO: NOT <head/>
    return html
  }
}

const transfer = (template, obj) => new Promise(async(resolve, reject) => {
  const TemplateNames = await getTemplateNames(template)
  if (!TemplateNames.length) {
    return ctx.body = `The template of ${template} could not find any html files.`
  } else {
    TemplateNames.map(templateName => {
      const templatePath = path.resolve(process.cwd(), 'packages', template, templateName)
      const oldHTML = fse.readFileSync(templatePath, "utf-8")
      const newHTML = injectJavaScriptIntoHTML(oldHTML, obj)
      fse.ensureDirSync(path.resolve(process.cwd(), 'dist/static', template))
      fse.writeFileSync(path.resolve(process.cwd(), 'dist/static', template, templateName), newHTML, { encoding: 'utf-8' })
      return resolve('OK')
    })
  }
})

/**
 * @param template
 * @return promise
 */
const getTemplateNames = template => new Promise((resolve, reject) => {
  glob('*.html', {
    cwd: path.resolve(process.cwd(), 'packages', template)
  }, (err, files) => {
    if (err) {
      return reject(err)
    } else {
      return resolve(files)
    }
  })
})

export const transform = app => {
  const router = new Router({
    prefix: '/transform'
  })

  router.post('/:template', async(ctx, next) => {
    const body = ctx.request.body
    let { template, code } = ctx.params
    await transfer(template, body)
  })

  router.get('/:template/:code',
    async(ctx, next) => {
      let { template, code } = ctx.params
      try {
        if (typeof code === 'string') {
          code = JSON.parse(code)
        }
        console.log(code)
        ctx.body = await transfer(template, code)
      } catch (e) {
        console.log(e)
        ctx.body = e.toString()
      }
      //await transfer(template, body)
    })

  router.get('/',
    async(ctx, next) => {
      ctx.body = '/transform/:name must be exist'
    })

  app.use(router.routes())
  app.use(router.allowedMethods())
}

export default transform
