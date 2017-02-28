import fse from 'fs-extra'

export const isDirectory = (pathString) => {
  try {
    return fse.statSync(pathString).isDirectory()
  } catch (e) {
    return false
  }
}
