import AWS from 'aws-sdk'
import { ddbCli, ddbDoc } from '../../db/ddb'

AWS.config.update({
  region: 'eu-west-2',
  endpoint: 'http://localhost:4569',
})
;(async function main() {
  const ddb = ddbCli()
  const ddbd = ddbDoc()
  const res = await ddb.listTables()
  console.log(res)
  const res2 = await ddbd.scan({ TableName: 'Accounts' })
  console.log(res2)
})()
