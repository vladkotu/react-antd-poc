import AWS from 'aws-sdk'
import request from 'supertest'
import { encodeId } from '../utils'
import { ddbCli } from '../db/ddb'
import * as AccountsSchema from '../db/AccountsSchema.json'
import * as AccountsDataSeed from '../db/AccountsDataSeed.json'
import * as ContractorsSchema from '../db/ContractorsSchema.json'
import * as ContractorsDataSeed from '../db/ContractorsDataSeed.json'
import app from '../app'
import config from 'config'

const dbCfg = config.get('ddb')
const __debug = false

AWS.config.update({
  region: dbCfg.region,
  endpoint: dbCfg.endpoint,
})

const testPostApi = (method, url, payload, expectation) => {
  request(app)
    [method](url)
    .type('json')
    .send(payload)
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(expectation)
}

const db = ddbCli()

const setupDatabase = async (tableName, schema, data, done) => {
  try {
    await db.createTable({
      ...schema,
      TableName: tableName,
    })
    __debug && console.log(`'${tableName}' - created`)
    await db.batchWriteItem({
      RequestItems: {
        [tableName]: data,
      },
    })
    __debug && console.log(`'${tableName}' - seeded`)
    done()
  } catch (err) {
    __debug && console.log(`'${tableName}' - create error`, err)
    done(err)
  }
}

const tearDownDatabse = async (tableName, done) => {
  try {
    await db.deleteTable({ TableName: tableName })
    __debug && console.log(`'${tableName}' - removed`)
    done()
  } catch (err) {
    __debug && console.log(`'${tableName}' - remove error`, err)
    done(err)
  }
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
    describe('accounts', () => {
      beforeEach(async done => {
        await setupDatabase(
          dbCfg.tables.accounts,
          AccountsSchema.default,
          AccountsDataSeed.default.Accounts,
          done
        )
      })

      afterEach(async done => {
        await tearDownDatabse(dbCfg.tables.accounts, done)
      })

      it('create bookkeeping account account', done => {
        const payload = {
          accType: 'bookkeeping',
          accNo: 111,
          category: 'Purchase',
          vatPercent: 11,
          vatCategoryS: 'P',
          accName: 'One one one',
        }
        testPostApi('post', '/api/accounts', payload, ({ body }) => {
          expect(body).toMatchObject({
            ...payload,
            vatCategoryS: 'P',
          })
          expect(body).toHaveProperty('id')
          done()
        })
      })

      it('get single existing account', done => {
        const item = AWS.DynamoDB.Converter.unmarshall(
          AccountsDataSeed.Accounts[0].PutRequest.Item
        )
        const dbid = item.id
        const createdDateTime = item.createdDateTime
        const id = encodeId({ id: dbid, createdDateTime })
        delete item.createdDateTime
        item.id = id
        request(app)
          .get(`/api/accounts/${id}`)
          .set('Accept', 'application/json')
          .expect(200, item, done)
      })

      it('create default account', done => {
        const payload = {
          accType: 'default',
          accNo: 111,
          category: 'Sales',
          vatPercent: 11,
          vatCategoryS: 'P',
          accName: 'One one one',
        }
        testPostApi('post', '/api/accounts', payload, ({ body }) => {
          expect(body).toMatchObject(payload)
          expect(body).toHaveProperty('id')
          done()
        })
      })

      it('get all accounts of a type', done => {
        request(app)
          .get('/api/accounts?type=default')
          .set('Accept', 'application/json')
          .expect(200)
          .then(({ body }) => {
            expect(body.items.length).toBe(2)
            expect(body.items[0]).toMatchObject({
              vatCategoryS: 'S',
              accNo: 55,
              accName: 'Roi Greens Backing Up',
              comment: 'Facere deleniti blanditiis eum.',
              id:
                'ZDgzZWYzYzAtNmQzNS0xMWVhLTlkNzctM2RmZmQ3ZDE4OTM5LDE0NDY5NjA5MzQwMjU%3D',
              accType: 'default',
              category: 'Sales',
              vatPercent: 49,
            })
            expect(body).toHaveProperty('count', 2)
            done()
          })
      })

      it('delete existing account', done => {
        const item = AccountsDataSeed.Accounts[0].PutRequest.Item
        const dbid = item.id.S
        const createdDateTime = item.createdDateTime.N
        const id = encodeId({ id: dbid, createdDateTime })
        request(app)
          .delete(`/api/accounts/${id}`)
          .set('Accept', 'application/json')
          .expect(200, done)
      })

      it('updates existing account', done => {
        const item = AWS.DynamoDB.Converter.unmarshall(
          AccountsDataSeed.Accounts[0].PutRequest.Item
        )
        const dbid = item.id
        const createdDateTime = item.createdDateTime
        const id = encodeId({ id: dbid, createdDateTime })
        const payload = {
          category: 'Purchase',
          vatCategoryS: 'P',
        }
        delete item.createdDateTime
        item.id = id
        request(app)
          .put(`/api/accounts/${id}/`)
          .set('Accept', 'application/json')
          .type('json')
          .send(payload)
          .expect(200)
          .then(({ body }) => {
            expect(body).toMatchObject({
              ...item,
              ...payload,
            })
            done()
          })
      })
    })

    describe('contractors', () => {
      beforeEach(async done => {
        await setupDatabase(
          dbCfg.tables.contractors,
          ContractorsSchema.default,
          ContractorsDataSeed.default.Contractors,
          done
        )
      })

      afterEach(async done => {
        await tearDownDatabse(dbCfg.tables.contractors, done)
      })

      it('create contractor', done => {
        const payload = {
          role: 'Developer',
          salary: 40000,
          fname: 'Luke',
          lname: 'Rocketman',
        }
        testPostApi('post', '/api/contractors', payload, ({ body }) => {
          expect(body).toMatchObject(payload)
          expect(body).toHaveProperty('id')
          done()
        })
      })

      it('get single existing contractor', done => {
        const item = AWS.DynamoDB.Converter.unmarshall(
          ContractorsDataSeed.Contractors[0].PutRequest.Item
        )
        const dbid = item.id
        const createdDateTime = item.createdDateTime
        const id = encodeId({ id: dbid, createdDateTime })
        delete item.createdDateTime
        item.id = id
        request(app)
          .get(`/api/contractors/${id}`)
          .set('Accept', 'application/json')
          .expect(200, item, done)
      })

      it('get all contractors', done => {
        request(app)
          .get('/api/contractors')
          .set('Accept', 'application/json')
          .expect(200)
          .then(({ body }) => {
            expect(body.items.length).toBe(5)
            expect(body.items[0]).toMatchObject({
              fname: 'Melisa',
              lname: 'Bogan',
              id:
                'ZDgzZmRlMjMtNmQzNS0xMWVhLTlkNzctM2RmZmQ3ZDE4OTM5LDE0ODU5NzU2NjM5NDI%3D',
              role: 'Assistant',
              salary: 73573,
            })
            expect(body).toHaveProperty('count', 5)
            done()
          })
      })

      it('delete existing contractor', done => {
        const item = ContractorsDataSeed.Contractors[0].PutRequest.Item
        const dbid = item.id.S
        const createdDateTime = item.createdDateTime.N
        const id = encodeId({ id: dbid, createdDateTime })
        request(app)
          .delete(`/api/contractors/${id}`)
          .set('Accept', 'application/json')
          .expect(200, done)
      })

      it('updates existing contractor', done => {
        const item = AWS.DynamoDB.Converter.unmarshall(
          ContractorsDataSeed.Contractors[0].PutRequest.Item
        )
        const dbid = item.id
        const createdDateTime = item.createdDateTime
        const id = encodeId({ id: dbid, createdDateTime })
        const payload = {
          fname: 'Larry',
          lname: 'King',
        }
        delete item.createdDateTime
        item.id = id
        request(app)
          .put(`/api/contractors/${id}`)
          .set('Accept', 'application/json')
          .type('json')
          .send(payload)
          .expect(200)
          .then(({ body }) => {
            expect(body).toMatchObject({
              ...item,
              ...payload,
            })
            done()
          })
      })
    })
  })
})
