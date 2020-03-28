import AWS from 'aws-sdk'
import config from 'config'
import { ddbCli, ddbDoc } from '../ddb'
import { setupDatabase, tearDownDatabse } from '../../utils'
import { logger } from '../../logger'
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

const tables = [
  {
    TableName: dbCfg.tables.accounts,
    Schema: AccountsSchema.default,
    Data: AccountsDataSeed.default.Accounts,
  },
  {
    TableName: dbCfg.tables.contractors,
    Schema: ContractorsSchema.default,
    Data: ContractorsDataSeed.default.Contractors,
  },
]

;(async function main() {
  try {
    logger.info(`DB Setup region:'${dbCfg.region}' host:'${dbCfg.endpoint}'`)
    for (let { TableName, Schema, Data } of tables) {
      logger.info(`Remove '${TableName}' START`)
      await tearDownDatabse(db, TableName)
      logger.info(`Remove '${TableName}' END`)

      logger.info(`Create table ${TableName} START`)
      await setupDatabase(db, TableName, Schema, Data)
      logger.info(`Create table ${TableName} END`)
    }
  } catch (err) {
    logger.error(err)
  }
})()
