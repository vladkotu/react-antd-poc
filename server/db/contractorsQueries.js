import { v1 as uuidv1 } from 'uuid'
import { ddbCli, ddbDoc } from '../db/ddb.js'

export const addContractor = async item => {
  try {
    const ddb = ddbDoc()
    const params = {
      TableName: 'Contractors',
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
export const fetchContractors = async item => {}
export const fetchSingleContractor = async item => {
  try {
    const ddb = ddbDoc()
    const params = {
      TableName: 'Contractors',
      Key: item,
    }
    const res = await ddb.get(params)
    return res.Item
  } catch (err) {
    console.log(err)
    throw err
  }
}
export const updateContractor = async item => {}
export const removeContractor = async item => {
  try {
    const ddb = ddbDoc()
    const params = {
      TableName: 'Contractors',
      Key: item,
    }
    await ddb.delete(params)
  } catch (err) {
    console.log(err)
    throw err
  }
}
