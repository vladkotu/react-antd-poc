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

export const fetchContractors = async (item) => {}
export const fetchSingleContractor = async (item) => {}
export const makeFetchItems = (ctx) => async (item) =>  {}

export const makeRemoveItem = ctx => async item => {
  await storeItems(
    ctx,
    (await getItems(ctx)).filter(({ id }) => item.id !== id)
  )
}

const getUpdateParamsByCtx = (ctx, item) => {
  if (['bookkeeping', 'default'].includes(ctx)) {
    return {
      TableName: 'Accounts',
      Key: {
        id: item.id,
        createdDateTime: parseInt(item.createdDateTime, 10),
      },
    }
  }
  if ('contractors' === ctx) {
    return {
      TableName: 'Contractors',
      Key: {
        id: item.id,
      },
    }
  }
}

export const makeUpdateItem = ctx => async item => {
  // 1. get item by primary key
  // 2. merge item with updated fields
  // 3. remove item form db
  // 4. write new item with old primary key
  try {
    const ddb = ddbDoc()
    const params = getUpdateParamsByCtx(ctx, item)
    console.log(params)
    const origItem = await ddb.get(params)
    console.log(origItem)
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const makeFakeApi = (ctx, schema) => ({
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
