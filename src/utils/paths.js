import path from 'path'
import fs from 'fs'

const appDirectory = fs.realpathSync(process.cwd())

const resolvePath = relativePath => path.resolve(appDirectory, relativePath)

export default {
  packages : resolvePath('packages'),
  statics  : resolvePath('dist/static'),
  resolve  : path.resolve,
}

export const resolve = path.resolve


