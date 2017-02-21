import Router from 'koa-router'
import fse from 'fs-extra'
import path from 'path'
import process from 'process'
import glob from 'glob'


const injectJavaScriptIntoHTML = html => {
  const headRegExp = /(<\/head>)/i;
  if (headRegExp.test(html)) {
    return html.replace(headRegExp, matched => {
      return '<script> var obj = 123; alert("Good")</script>\n' + matched
    })
  } else {
    // TODO: NOT <head/>
    return html
  }
}

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

  router.get('/:template',
    async(ctx, next) => {
      const { template } = ctx.params

      const TemplateNames = await getTemplateNames(template)
      if (!TemplateNames.length) {
        return ctx.body = `The template of ${template} could not find any html files.`
      } else {
        TemplateNames.map(templateName => {
          const templatePath = path.resolve(process.cwd(), 'packages', template, templateName)
          const oldHTML = fse.readFileSync(templatePath, "utf-8")
          const newHTML = injectJavaScriptIntoHTML(oldHTML)
          fse.ensureDirSync(path.resolve(process.cwd(), 'dist/static', template))
          fse.writeFileSync(path.resolve(process.cwd(), 'dist/static', template, templateName), newHTML, { encoding: 'utf-8' })
        })

        ctx.body = TemplateNames
      }
    })

  router.get('/',
    async(ctx, next) => {
      ctx.body = '/transform/:name must be exist'
    })

  app.use(router.routes())
  app.use(router.allowedMethods())
}

export default transform
