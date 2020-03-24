import { v1 as uuidv1 } from 'uuid'
import { ddbCli, ddbDoc } from '../db/ddb.js'

export const addAccount = async item => {
  try {
    const ddb = ddbDoc()
    const params = {
      TableName: 'Accounts',
      Item: {
        id: uuidv1(),
        createdDateTime: new Date().getTime(),
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
export const fetchAccounts = async item => {}
export const fetchSingleAccount = async item => {
  try {
    const ddb = ddbDoc()
    const params = {
      TableName: 'Accounts',
      Key: item,
    }
    const res = await ddb.get(params)
    return res.Item
  } catch (err) {
    console.error(err)
    throw err
  }
}
export const updateAccount = async item => {}
export const removeAccount = async item => {
  try {
    const ddb = ddbDoc()
    const params = {
      TableName: 'Accounts',
      Key: item,
    }
    await ddb.delete(params)
  } catch (err) {
    console.error(err)
    throw err
  }
}
