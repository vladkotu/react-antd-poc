import mocker from 'mocker-data-generator'
import f from 'faker'
import localStorage from 'node-persist'

export const randomNumBut = (from, to, exclude = [], retries = 10) => {
  const id = f.random.number({ min: from, max: to })
  if (-1 === exclude.indexOf(id)) {
    return id
  } else if (0 === retries) {
    return undefined
  } else {
    randomNumBut(from, to, exclude, --retries)
  }
}

export const getItems = async ctx => await localStorage.getItem(ctx)
export const storeItems = async (ctx, ix) => await localStorage.setItem(ctx, ix)

export const makeFetchItems = (ctx, schema) => async (n = 3) => {
  const items = await getItems(ctx)
  if (items && items.length) return items
  else
    return mocker()
      .schema(ctx, schema, n)
      .build()
      .then(data => {
        storeItems(ctx, data[ctx])
        return data[ctx]
      })
}

export const makeRemoveItem = ctx => async item => {
  await storeItems(ctx, await getItems(ctx).filter(({ id }) => item.id !== id))
  return await getItems(ctx)
}

export const makeAddItem = ctx => async acc => {
  const currentItems = await getItems(ctx)
  acc.id = randomNumBut(
    10,
    1000,
    currentItems.map(i => i.id)
  )
  await storeItems(ctx, [acc, ...currentItems])
  return await getItems(ctx)
}

export const makeUpdateItem = ctx => async acc => {
  const items = await getItems(ctx)
  const idx = items.findIndex(a => a.id === acc.id)
  items[idx] = acc
  await storeItems(ctx, items)
  return await getItems(ctx)
}

export const makeFakeApi = (ctx, schema) => ({
  addItem: makeAddItem(ctx),
  fetchItems: makeFetchItems(ctx, schema),
  updateItem: makeUpdateItem(ctx),
  removeItem: makeRemoveItem(ctx),
})
;(async function init() {
  await localStorage.init()
})()
