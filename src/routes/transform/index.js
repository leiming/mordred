import Router from 'koa-router'
import fse from 'fs-extra'
import path from 'path'
import process from 'process'
import glob from 'glob'

const getResult = (data = "", msg = "OK", status = 200) => {
  const result = {
    status,
    msg,
  }
  return data ? { ...result, data: data } : result
}

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
  const temlatePath = path.resolve(process.cwd(), 'packages', template);
  try {
    fse.copySync(temlatePath, path.resolve(process.cwd(), 'dist/static', template))
    console.log('copy file success.')
  } catch (e) {
    return reject('copy file failed.')
  }

  // TODO 只是读取除了html文件
  const TemplateNames = await getTemplateNames(template)
  if (!TemplateNames.length) {
    return reject(`The template of ${template} could not find any html files.`)
  } else {
    TemplateNames.map(templateName => {
      const templateHtmlPath = path.resolve(process.cwd(), 'packages', template, templateName)
      const oldHTML = fse.readFileSync(templateHtmlPath, "utf-8")
      const newHTML = injectJavaScriptIntoHTML(oldHTML, obj)
      fse.ensureDirSync(path.resolve(process.cwd(), 'dist/static', template))
      fse.writeFileSync(path.resolve(process.cwd(), 'dist/static', template, templateName), newHTML, { encoding: 'utf-8' })
      return resolve(getResult({ aaa: 123 }))
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

  // TODO : 不叫这个名字
  router.post('/:template', async(ctx, next) => {
    const body = ctx.request.body
    let { template, code } = ctx.params

    try {
      const res = await transfer(template, body)
      return ctx.body = getResult(res)
    } catch (e) {
      //console.log(e)
      return ctx.body = getResult(null, e.message, 500)
    }

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
