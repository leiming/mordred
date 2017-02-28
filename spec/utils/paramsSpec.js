import {isDirectory} from '../../src/utils/params'

describe('Params Util', () => {
  const cwd = process.cwd()

  it('should check is directory', done => {
    expect(isDirectory(cwd + '/src')).toBe(true)
    expect(isDirectory(cwd + '/package.json')).toBe(false)
    expect(isDirectory(cwd + '/non-exist')).toBe(false)
    done()
  })

})
