import AWS from 'aws-sdk'
import request from 'supertest'
import { ddbCli, ddbDoc } from '../db/ddb'
import * as accTable from '../../db/Accounts.json'
import app from '../app'

AWS.config.update({
  region: 'eu-west-2',
  endpoint: 'http://localhost:4569',
})

describe('accounts api', () => {
  it('Not found', done => {
    request(app)
      .get('/not-exits')
      .set('Accept', 'application/json')
      .expect(404)
      .expect('Content-Type', /json/)
      .end(done)
  })
  describe('crud', () => {
    const dd = ddbCli()
    const dbDoc = ddbDoc()

    beforeEach(async () => {
      const t = await dd.createTable(accTable.default)
    })

    afterEach(async () => {
      await dd.deleteTable({ TableName: 'Accounts' })
    })

    it('create account', done => {
      request(app)
        .post('/api/accounts?type=bookkeeping')
        .type('json')
        .send({
          accNo: 111,
          category: 'Purchase',
          vatPercent: 11,
          vatCategoryS: 'P',
          accName: 'One one one',
        })
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(({ body }) => {
          console.log(body)
          expect(body.count).toBe(5)
          done()
        })
    })
  })
})

// request(app)
//   .get('/api/accounts?type=bookkeeping')
//   .set('Accept', 'application/json')
//   .expect(200)
//   .expect('Content-Type', /json/)
//   .then(({ body }) => {
//     expect(body.count).toBe(5)
//     done()
//   })
