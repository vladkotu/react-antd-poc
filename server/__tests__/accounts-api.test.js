import AWS from 'aws-sdk'
import request from 'supertest'
import { ddbCli, ddbDoc } from '../db/ddb'
import * as accountsTable from '../../db/Accounts.json'
import * as accountsSeedTable from '../../db/accounts-seed.json'
import * as contractorsTable from '../../db/Contractors.json'
import * as contractorsSeedTable from '../../db/Contractors-seed.json'
import app from '../app'

AWS.config.update({
  region: 'eu-west-2',
  endpoint: 'http://localhost:4569',
})

const testApi = (method, url, payload, expectation) => {
  request(app)
    [method](url)
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
        await dd.createTable(accountsTable.default)
        await dd.batchWriteItem({
          RequestItems: accountsSeedTable.default,
        })
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
        testApi(
          'post',
          '/api/accounts?type=bookkeeping',
          payload,
          ({ body }) => {
            expect(body).toMatchObject({
              ...payload,
              vatCategoryS: 'P',
            })
            expect(body).toHaveProperty('id')
            expect(body).toHaveProperty('createdDateTime')
            done()
          }
        )
      })

      it('create default account', done => {
        const payload = {
          accNo: 111,
          category: 'Sales',
          vatPercent: 11,
          vatCategoryS: 'P',
          accName: 'One one one',
        }
        testApi('post', '/api/accounts?type=default', payload, ({ body }) => {
          expect(body).toMatchObject(payload)
          expect(body).toHaveProperty('id')
          expect(body).toHaveProperty('createdDateTime')
          done()
        })
      })


      xit('updates existing account', done => {
        const id = accountsSeedTable.Accounts[0].PutRequest.Item.id.S
        const createdDateTime = accountsSeedTable.Accounts[0].PutRequest.Item.createdDateTime.N
        const payload = {
          createdDateTime,
          category: 'Purchase',
          vatCategoryS: 'P',
        }
        testApi('put', `/api/accounts/${id}/?type=default`, payload, ({ body }) => {
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
        await dd.batchWriteItem({
          RequestItems: contractorsSeedTable.default,
        })
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
        testApi('post', '/api/contractors', payload, ({ body }) => {
          expect(body).toMatchObject(payload)
          expect(body).toHaveProperty('id')
          expect(body).toHaveProperty('createdDateTime')
          done()
        })
      })
    })
  })
})
