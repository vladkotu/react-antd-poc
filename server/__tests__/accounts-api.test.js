import AWS from 'aws-sdk'
import request from 'supertest'
import { ddbCli, ddbDoc } from '../db/ddb'
import * as accTable from '../../db/Accounts.json'
import * as contractorsTable from '../../db/Contractors.json'
import app from '../app'

AWS.config.update({
  region: 'eu-west-2',
  endpoint: 'http://localhost:4569',
})

const testApi = (url, payload, expectation) => {
  request(app)
    .post(url)
    .type('json')
    .send(payload)
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(expectation)
}

describe('api', () => {
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

    describe('accounts', () => {
      beforeEach(async () => {
        await dd.createTable(accTable.default)
      })

      afterEach(async () => {
        await dd.deleteTable({ TableName: 'Accounts' })
      })

      it('create bookkeeping account account', done => {
        const payload = {
          accNo: 111,
          category: 'Purchase',
          vatPercent: 11,
          vatCategoryS: 'P',
          accName: 'One one one',
        }
        testApi('/api/accounts?type=bookkeeping', payload, ({ body }) => {
          expect(body).toMatchObject({
            ...payload,
            vatCategoryS: 'P',
          })
          expect(body).toHaveProperty('id')
          expect(body).toHaveProperty('createdDateTime')
          done()
        })
      })

      it('create default account account', done => {
        const payload = {
          accNo: 111,
          category: 'Sales',
          vatPercent: 11,
          vatCategoryS: 'P',
          accName: 'One one one',
        }
        testApi('/api/accounts?type=default', payload, ({ body }) => {
          expect(body).toMatchObject(payload)
          expect(body).toHaveProperty('id')
          expect(body).toHaveProperty('createdDateTime')
          done()
        })
      })
    })

    describe('contractors', () => {
      beforeEach(async () => {
        await dd.createTable(contractorsTable.default)
      })

      afterEach(async () => {
        await dd.deleteTable({ TableName: 'Contractors' })
      })

      it('create contractor', done => {
        const payload = {
          role: 'Developer',
          salary: 40000,
          fname: 'Luke',
          lname: 'Rocketman',
        }
        testApi('/api/contractors', payload, ({ body }) => {
          expect(body).toMatchObject(payload)
          expect(body).toHaveProperty('id')
          expect(body).toHaveProperty('createdDateTime')
          done()
        })
      })
    })
  })
})
