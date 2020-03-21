import { fetchIt } from '../utils'
import { BOOKEE, DEFACC } from '../constants'

const host = () => `${document.location.protocol}//${document.location.host}`

const makeAddItem = type => async item => {
  try {
    const data = await fetchIt(`${host()}/api/accounts`, {
      method: 'POST',
      searchParams: { type },
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
const makeUpdateItem = type => async item => {
  try {
    const data = await fetchIt(`${host()}/api/accounts/${item.id}`, {
      method: 'PUT',
      searchParams: { type },
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
const makeRemoveItem = type => async ({ id }) => {
  try {
    const data = await fetchIt(`${host()}/api/accounts/${id}`, {
      method: 'DELETE',
      searchParams: { type },
    })
    return data
  } catch (err) {
    console.error(err)
  }
}

const makeFetchItems = type => async n => {
  try {
    const data = await fetchIt(`${host()}/api/accounts`, {
      method: 'GET',
      searchParams: { type, limit: n || 5 },
    })
    return data.items
  } catch (err) {
    console.error(err)
  }
}

const makeApi = ctx => ({
  addItem: makeAddItem(ctx),
  fetchItems: makeFetchItems(ctx),
  removeItem: makeRemoveItem(ctx),
  updateItem: makeUpdateItem(ctx),
})

export default {
  [BOOKEE]: makeApi(BOOKEE),
  [DEFACC]: makeApi(DEFACC),
}
