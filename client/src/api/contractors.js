import { host, fetchIt } from '../utils'

const makeAddItem = () => async item => {
  try {
    const data = await fetchIt(`${host()}/api/contractors`, {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return data
  } catch (err) {
    console.error(err)
  }
}

const makeUpdateItem = () => async item => {
  try {
    const data = await fetchIt(`${host()}/api/contractors/${item.id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return data
  } catch (err) {
    console.error(err)
  }
}

const makeRemoveItem = () => async ({ id }) => {
  try {
    const data = await fetchIt(`${host()}/api/contractors/${id}`, {
      method: 'DELETE',
    })
    return data
  } catch (err) {
    console.error(err)
  }
}

const makeFetchItems = () => async () => {
  try {
    const data = await fetchIt(`${host()}/api/contractors`, {
      method: 'GET',
    })
    return data.items
  } catch (err) {
    console.error(err)
  }
}

export default {
  addItem: makeAddItem(),
  fetchItems: makeFetchItems(),
  removeItem: makeRemoveItem(),
  updateItem: makeUpdateItem(),
}
