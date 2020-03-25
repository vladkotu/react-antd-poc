import { v1 as uuidv1 } from 'uuid'
import { ddbCli, ddbDoc } from '../db/ddb.js'
import config from 'config'

const dbCfg = config.get('ddb')

export const addAccount = async item => {
  try {
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
    return res.Attributes
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const fetchAccounts = async type => {
  try {
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
    return res
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const fetchSingleAccount = async item => {
  try {
    const ddb = ddbDoc()
    const { id, createdDateTime } = item
    const params = {
      TableName: dbCfg.tables.accounts,
      Key: { id, createdDateTime },
    }
    const res = await ddb.get(params)
    return res.Item
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const removeAccount = async item => {
  try {
    const ddb = ddbDoc()
    const { id, createdDateTime } = item
    const params = {
      TableName: dbCfg.tables.accounts,
      Key: { id, createdDateTime },
    }
    await ddb.delete(params)
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const updateAccount = async item => {
  try {
    const origItem = await fetchSingleAccount(item)
    const newItem = { ...origItem, ...item }
    await removeAccount(item)
    return await addAccount(newItem)
  } catch (err) {
    console.error(err)
    throw err
  }
}
