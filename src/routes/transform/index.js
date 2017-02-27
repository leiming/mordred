import Router from 'koa-router'
import fse from 'fs-extra'
import paths, { resolve } from '../../utils/paths'
import { getResult } from '../../utils/responses'

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

const generateHTML = (template, templateName, obj) => {
  const templateHtmlPath = resolve(paths.packages, template, templateName)
  const oldHTML = fse.readFileSync(templateHtmlPath, "utf-8")
  const newHTML = injectJavaScriptIntoHTML(oldHTML, obj)
  fse.ensureDirSync(resolve(paths.statics, template))
  fse.writeFileSync(resolve(paths.statics, template, templateName), newHTML, { encoding: 'utf-8' })
}


const isDirectory = (pathString) => {
  try {
    return fse.statSync(pathString).isDirectory()
  } catch (e) {
    return false
  }
}

const transfer = (template, obj) => {

  if (!template) {
    return getResult(null, 'Template is null', 404)
  }

  if (!isDirectory(resolve(paths.packages, template))) {
    return getResult(null, 'Template is not directory', 404)
  }

  fse.copySync(resolve(paths.packages, template), resolve(paths.statics, template))

  const templateNames = getTemplateNames(template)
  if (!templateNames.length) {
    return getResult(null, "Template should contain least one HTML file", 404)
  }

  templateNames.map(templateName => {
    return generateHTML(template, templateName, obj)
  })
  return getResult(obj)
}


/**
 * @param template
 * @return promise
 */
const getTemplateNames = template => glob.sync('*.html', {
  cwd: resolve(paths.packages, template)
})

export const transform = app => {
  const router = new Router({
    prefix: '/transform'
  })

  router.get('/:template', async(ctx, next) => {
    ctx.body = getResult(null, '/transform/:template/:code, code is empty in GET method', 404)
  })

  router.get('/:template/:code',
    async(ctx, next) => {
      let { template, code } = ctx.params
      try {
        if (typeof code === 'string') {
          code = JSON.parse(code)
        }
        ctx.body = transfer(template, code)
      } catch (e) {
        console.log(e)
        ctx.body = e.toString()
      }
    })

  router.post('/:template', async(ctx, next) => {
    const codeData = ctx.request.body
    let { template } = ctx.params
    try {
      const res = await transfer(template, codeData)
      return ctx.body = res
    } catch (e) {
      return ctx.body = getResult(null, e.message, 500)
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
