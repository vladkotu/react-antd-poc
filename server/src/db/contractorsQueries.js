import { v1 as uuidv1 } from 'uuid'
import { encodeItem, decodeItem } from '../utils'
import { ddbDoc } from '../db/ddb.js'
import config from 'config'

const dbCfg = config.get('ddb')

export const addContractor = async item => {
  const ddb = ddbDoc()
  const { id, createdDateTime } = item
  const params = {
    TableName: dbCfg.tables.contractors,
    Item: {
      id: id || uuidv1(),
      createdDateTime: createdDateTime || new Date().getTime(),
      ...item,
    },
  }
  const res = await ddb.put(params)
  return encodeItem(res.Attributes)
}

export const fetchContractors = async () => {
  const ddb = ddbDoc()
  const params = {
    TableName: dbCfg.tables.contractors,
  }
  const res = await ddb.scan(params)
  return { items: res.Items.map(encodeItem), count: res.Count }
}

export const fetchSingleContractor = async encoded => {
  const item = decodeItem(encoded)
  const ddb = ddbDoc()
  const { id, createdDateTime } = item
  const params = {
    TableName: dbCfg.tables.contractors,
    Key: { id, createdDateTime },
  }
  const res = await ddb.get(params)
  return encodeItem(res.Item)
}

export const removeContractor = async encoded => {
  const item = decodeItem(encoded)
  const ddb = ddbDoc()
  const { id, createdDateTime } = item
  const params = {
    TableName: dbCfg.tables.contractors,
    Key: { id, createdDateTime },
  }
  await ddb.delete(params)
}

export const updateContractor = async encoded => {
  const item = decodeItem(encoded)
  const origItem = await fetchSingleContractor(encoded)
  const newItem = { ...origItem, ...item }
  await removeContractor(encoded)
  return await addContractor(newItem)
}
