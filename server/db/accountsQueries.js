import { v1 as uuidv1 } from 'uuid'
import { encodeItem, decodeItem } from '../utils'
import { ddbCli, ddbDoc } from '../db/ddb.js'
import config from 'config'

const dbCfg = config.get('ddb')

export const addAccount = async item => {
  const ddb = ddbDoc()
  const { id, createdDateTime } = item
  const params = {
    TableName: dbCfg.tables.accounts,
    Item: {
      id: id || uuidv1(),
      createdDateTime: createdDateTime || new Date().getTime(),
      ...item,
    },
  }
  const res = await ddb.put(params)
  return encodeItem(res.Attributes)
}

export const fetchAccounts = async type => {
  const ddb = ddbDoc()
  const params = {
    TableName: dbCfg.tables.accounts,
    IndexName: 'accType',
    KeyConditionExpression: 'accType = :accType',
    ExpressionAttributeValues: {
      ':accType': type,
    },
  }
  const res = await ddb.query(params)
  return { items: res.Items.map(encodeItem), count: res.Count }
}

export const fetchSingleAccount = async encoded => {
  const item = decodeItem(encoded)
  const ddb = ddbDoc()
  const { id, createdDateTime } = item
  const params = {
    TableName: dbCfg.tables.accounts,
    Key: { id, createdDateTime },
  }
  const res = await ddb.get(params)
  return encodeItem(res.Item)
}

export const removeAccount = async encoded => {
  const item = decodeItem(encoded)
  const ddb = ddbDoc()
  const { id, createdDateTime } = item
  const params = {
    TableName: dbCfg.tables.accounts,
    Key: { id, createdDateTime },
  }
  await ddb.delete(params)
}

export const updateAccount = async encoded => {
  const item = decodeItem(encoded)
  const origItem = await fetchSingleAccount(encoded)
  const newItem = { ...origItem, ...item }
  await removeAccount(encoded)
  return await addAccount(newItem)
}
