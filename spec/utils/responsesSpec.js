import {getResult} from '../../src/utils/responses'

describe('Response Util', () => {
   it('should return correct result', done => {
     expect(getResult()).toEqual({status: 200, msg: 'OK'})
     expect(getResult({bar: {foo: "jam"}})).toEqual({
       status: 200,
       msg: 'OK',
       data: {bar: {foo: "jam"}}
     })
     done()
   })

  it('should return error result', done => {
     expect(getResult(null, 'some error', 500)).toEqual({
       status: 500,
       msg: 'some error',
     })
    done()
  })
})
