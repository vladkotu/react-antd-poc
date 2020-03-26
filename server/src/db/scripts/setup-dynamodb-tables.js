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

;(async function() {
  if ('--reset' === action) {
    const tables = Object.values(dbCfg.tables)
    tables.forEach(async tableName => {
      try {
        await db.deleteTable({ TableName: tableName })
        console.log(`'${tableName}' table removed`)
      } catch (err) {
        console.log(`Cannot remove '${tableName} table'`)
      }
    })
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
