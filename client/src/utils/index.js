import mocker from 'mocker-data-generator'
import f from 'faker'

export const preventAndCall = (f, ...args) => ev => {
  ev.preventDefault()
  return f.call(null, ...args)
}

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

// fake api utils
export const getItems = ctx => JSON.parse(localStorage.getItem(ctx))
export const storeItems = (ctx, ix) =>
  localStorage.setItem(ctx, JSON.stringify(ix))

export const makeFetchItems = (ctx, schema) => (n = 3) => {
  const items = getItems(ctx)
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

export const makeRemoveItem = ctx => item => {
  storeItems(
    ctx,
    getItems(ctx).filter(({ id }) => item.id !== id)
  )
  return Promise.resolve(getItems(ctx))
}

export const makeAddItem = ctx => acc => {
  const currentItems = getItems(ctx)
  acc.id = randomNumBut(
    10,
    1000,
    currentItems.map(i => i.id)
  )
  storeItems(ctx, [acc, ...currentItems])
  return Promise.resolve(getItems(ctx))
}

export const makeUpdateItem = ctx => acc => {
  const items = getItems(ctx)
  const idx = items.findIndex(a => a.id === acc.id)
  items[idx] = acc
  storeItems(ctx, items)
  return Promise.resolve(getItems(ctx))
}

export const makeFakeApi = (ctx, schema) => ({
  addItem: makeAddItem(ctx),
  fetchItems: makeFetchItems(ctx, schema),
  updateItem: makeUpdateItem(ctx),
  removeItem: makeRemoveItem(ctx),
})

export { default as fetchIt } from './fetchIt'
