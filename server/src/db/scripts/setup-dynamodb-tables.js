import AWS from 'aws-sdk'
import config from 'config'
import { ddbCli, ddbDoc } from '../ddb'
import { setupDatabase, tearDownDatabse } from '../../utils'
import * as AccountsSchema from '../AccountsSchema.json'
import * as AccountsDataSeed from '../AccountsDataSeed.json'
import * as ContractorsSchema from '../ContractorsSchema.json'
import * as ContractorsDataSeed from '../ContractorsDataSeed.json'

const action = process.argv.slice(2)[0]
const dbCfg = config.get('ddb')

AWS.config.update({
  region: dbCfg.region,
  endpoint: dbCfg.endpoint,
})

const db = ddbCli()
const dbDoc = ddbDoc()

;(async function main() {
  if ('--reset' === action) {
    let tableName = dbCfg.tables.accounts
    try {
      await tearDownDatabse(db, tableName)
    } catch (err) {
      console.log(`Cannot remove '${tableName} table'`, err)
    }
    tableName = dbCfg.tables.contractors
    try {
      await tearDownDatabse(db, tableName)
    } catch (err) {
      console.log(`Cannot remove '${tableName} table'`, err)
    }
  }
  try {
    console.log('Settling up Accounts table')
    await setupDatabase(
      db,
      dbCfg.tables.accounts,
      AccountsSchema.default,
      AccountsDataSeed.default.Accounts,
      () => console.log('Done!')
    )
  } catch (err) {
    console.log(`Cannot create 'Accounts' table`)
  }

  try {
    console.log('Settling up Contractors table')
    await setupDatabase(
      db,
      dbCfg.tables.contractors,
      ContractorsSchema.default,
      ContractorsDataSeed.default.Contractors,
      () => console.log('Done!')
    )
  } catch (err) {
    console.log(`Cannot create 'Contractors' table`)
  }
})()
