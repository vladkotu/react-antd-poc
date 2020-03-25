import { v1 as uuidv1 } from 'uuid'
import { ddbCli, ddbDoc } from '../db/ddb.js'

export const addContractor = async item => {
  try {
    const ddb = ddbDoc()
    const { id, createdDateTime } = item
    const params = {
      TableName: 'Contractors',
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

export const fetchContractors = async () => {
  try {
    const ddb = ddbDoc()
    const params = {
      TableName: 'Contractors',
    }
    const res = await ddb.scan(params)
    return res
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const fetchSingleContractor = async item => {
  try {
    const ddb = ddbDoc()
    const { id, createdDateTime } = item
    const params = {
      TableName: 'Contractors',
      Key: { id, createdDateTime },
    }
    const res = await ddb.get(params)
    return res.Item
  } catch (err) {
    console.log(err)
    throw err
  }
}
export const removeContractor = async item => {
  try {
    const ddb = ddbDoc()
    const { id, createdDateTime } = item
    const params = {
      TableName: 'Contractors',
      Key: { id, createdDateTime },
    }
    await ddb.delete(params)
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const updateContractor = async item => {
  try {
    const origItem = await fetchSingleContractor(item)
    const newItem = { ...origItem, ...item }
    await removeContractor(item)
    return await addContractor(newItem)
  } catch (err) {
    console.error(err)
    throw err
  }
}
