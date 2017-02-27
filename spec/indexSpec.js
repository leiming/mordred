const app = require('../src/index')
const request = require('supertest').agent(app.listen())
const finishTest = require('./helpers/finishTest')

describe('Transform GET method', () => {

  it('should get template list', done => {
    request.get('/templates')
      .expect(200)
      .expect('content-type', 'application/json; charset=utf-8')
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true)
      })
      .end(finishTest(done))
  })

  it('should transform by GET method', done => {
    request.get('/transform/basic/{"bar":"foo"}')
      .expect(200)
      .expect('content-type', 'application/json; charset=utf-8')
      .expect({
        "status": 200,
        "msg": "OK",
        "data": {
          "bar": "foo"
        }
      })
      .end(finishTest(done))
  })

  it('should get empty directory', done => {
    request.get('/transform/basic')
      .expect(200)
      .expect({
        "status": 404,
        "msg": '/transform/:template/:code, code is empty in GET method'
      })
      .end(finishTest(done))
  })

  it('should return 404 when HTML file exists', done => {
    request.get('/transform/not-html-case/{"bar": "foo"}')
      .expect(200)
      .expect({
        "status": 404,
        "msg": "Template should contain least one HTML file"
      })
      .end(finishTest(done))
  })

  it('404', done => {
    request.get('/404').expect(404).end(finishTest(done))
  })

})

describe('Transform POST method', () => {

  it('should send data by body', done => {
    request
      .post('/transform/basic')
      .send({
        foo: "bar"
      })
      .expect(200)
      .expect({
        status: 200,
        msg: "OK",
        data: { foo: "bar" },
      })
      .end(finishTest(done))
  })

})
