const app = require('../src/index')
const request = require('supertest').agent(app.listen())
const finishTest = require('./helpers/finishTest')

describe('request', () => {

  it('Get template list', (done) => {
    request.get('/templates')
      .expect(200)
      .expect('content-type', 'application/json; charset=utf-8')
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true)
      })
      .end(finishTest(done))
  })

  it('Transform by GET method', (done) => {
    request.get('/transform/basic/{"aaa":123}')
      .expect(200)
      .expect('content-type', 'application/json; charset=utf-8')
      .expect({
        "status": 200,
        "msg": "OK",
        "data": {
          "aaa": 123
        }
      })
      .end(finishTest(done))
  })


  it('404', (done) => {
    request.get('/404').expect(404).end(finishTest(done))
  })
})
