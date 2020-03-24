import mocker from 'mocker-data-generator'
import f from 'faker'
import localStorage from 'node-persist'
import { ddbCli, ddbDoc } from './db/ddb.js'
import { v1 as uuidv1 } from 'uuid'
import { validationResult } from 'express-validator'

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
  await storeItems(
    ctx,
    (await getItems(ctx)).filter(({ id }) => item.id !== id)
  )
}

const getPutParamsByCtx = (ctx, item) => {
  const itemParams = {
    id: uuidv1(),
    createdDateTime: new Date().getTime(),
    ...item,
  }
  if (['bookkeeping', 'default'].includes(ctx)) {
    return {
      TableName: 'Accounts',
      Item: {
        accType: ctx,
        ...itemParams,
      },
    }
  }
  if ('contractors' === ctx) {
    return {
      TableName: 'Contractors',
      Item: {
        ...itemParams,
      },
    }
  }
  throw new Error('Context have to be known')
}

export const makeAddItem = ctx => {
  return async item => {
    try {
      const ddb = ddbDoc()
      const params = getPutParamsByCtx(ctx, item)
      const res = await ddb.put(params)
      return res.Attributes
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

export const makeUpdateItem = ctx => async acc => {
  const items = await getItems(ctx)
  const idx = items.findIndex(a => a.id === acc.id)
  const item = { ...items[idx], ...acc }
  items[idx] = item
  await storeItems(ctx, items)
  return item
}

export const makeFakeApi = (ctx, schema) => ({
  addItem: makeAddItem(ctx),
  fetchItems: makeFetchItems(ctx, schema),
  updateItem: makeUpdateItem(ctx),
  removeItem: makeRemoveItem(ctx),
})

export const checkErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  next()
}

export function titleCase(string) {
  return string
    .toLowerCase()
    .split(' ')
    .map(s => {
      return s[0].toUpperCase() + s.slice(1)
    })
    .join(' ')
}

export function isEmptyObj(o) {
  return Object.keys(o).length === 0 && o.constructor === Object
}

export function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

export function stripEmptyAttrs(o) {
  const filtered = Object.entries(o).filter(([k, v]) => {
    return null !== v && undefined !== v && v
  })
  return Object.fromEntries(filtered)
}

export const oneOf = opts => () => f.random.arrayElement(opts)
export const randomDateFrom = (y, m, d) => () =>
  randomDate(new Date(y, m, d), new Date()).getTime()
;(async function init() {
  await localStorage.init()
})()
