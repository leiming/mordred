const app = require('../src/index')
const request = require('supertest').agent(app.listen())
const finishTest = require('./helpers/finishTest')



describe('Template GET method', () => {
  it('should get template list', done => {
    request.get('/templates')
      .expect(200)
      .expect('content-type', 'application/json; charset=utf-8')
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true)
      })
      .end(finishTest(done))
  })
})


describe('Transform GET method', () => {

  it('should transform by GET method', done => {
    request.get('/transform/basic/{"bar":"foo"}')

      .expect('content-type', 'application/json; charset=utf-8')
      .expect(200, {
        status: 200,
        msg: "OK",
        data: {
          previewPage: "/static/basic",
          globalData: { "bar": "foo" }
        }
      })
      .end(finishTest(done))
  })

  it('should get empty directory', done => {
    request.get('/transform/basic')
      .expect(200, {
        "status": 404,
        "msg": '/transform/:template/:code, code is empty in GET method'
      })
      .end(finishTest(done))
  })

  it('should not visit when HTML file exists', done => {
    request.get('/transform/not-html-case/{"bar": "foo"}')
      .expect(200, {
        "status": 404,
        "msg": "Template should contain least one HTML file"
      })
      .end(finishTest(done))
  })

  it('should return 404 response when visit undefined router', done => {
    request.get('/404').expect(404).end(finishTest(done))
  })

})

describe('Transform POST method', () => {

  const templateName = 'basic'
  const globalData = {
    foo: "bar"
  }

  it('should not send non-existent template', done => {
    request.post(`/transform/not-exist`)
      .send(globalData)
      .expect(200, {
        status: 404,
        msg: 'Template is not directory',
      })
      .end(finishTest(done))
  })

  it('should send data by body', done => {
    request
      .post(`/transform/${templateName}`)
      .send(globalData)
      .expect(200, {
        status: 200,
        msg: "OK",
        data: {
          previewPage: `/static/${templateName}`,
          globalData: globalData,
        }
      })
      .end((err, res) => {
        const { previewPage } = res.body.data
        request.get(previewPage)
          .expect(200, (err, res) => {
            expect(res.text).toMatch(JSON.stringify(globalData, null, 2))
            done()
          })
      })
  })

})
