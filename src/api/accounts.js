import mocker from 'mocker-data-generator'
import f from 'faker'
import { randomNumBut } from '../utils'

const schema = {
  id: { faker: 'random.number({"min": 10, "max": 100})' },
  accNo: { faker: 'random.number({"min": 10, "max": 100})' },
  category: {
    function: () => f.random.arrayElement(['Sales', 'Purchase']),
  },
  vatPercent: { faker: 'random.number({"min": 1, "max": 100})' },
  vatCategoryS: {
    function: function() {
      return this.object.category.substr(0, 1)
    },
  },
  accName: { faker: 'random.words' },
  extRevenuClass: { static: null },
  extTaxCode: { static: null },
  comment: { static: null },
}

// localStorage.removeItem('accounts')
const getItems = ctx => JSON.parse(localStorage.getItem(ctx))
const storeItems = (ctx, ix) => localStorage.setItem(ctx, JSON.stringify(ix))

const makeFetchItems = ctx => (n = 3) => {
  const accounts = getItems(ctx)
  if (accounts && accounts.length) return accounts
  else
    return mocker()
      .schema('acc', schema, n)
      .build()
      .then(({ acc }) => {
        storeItems(ctx, acc)
        return acc
      })
}

const makeRemoveItem = ctx => account => {
  storeItems(
    ctx,
    getItems(ctx).filter(({ id }) => account.id !== id)
  )
  return Promise.resolve(getItems(ctx))
}

const makeAddItem = ctx => acc => {
  const currentItems = getItems(ctx)
  acc.id = randomNumBut(
    10,
    1000,
    currentItems.map(i => i.id)
  )
  storeItems(ctx, [acc, ...currentItems])
  return Promise.resolve(getItems(ctx))
}

const makeUpdateItem = ctx => acc => {
  const accounts = getItems(ctx)
  const idx = accounts.findIndex(a => a.id === acc.id)
  accounts[idx] = acc
  storeItems(ctx, accounts)
  return Promise.resolve(getItems(ctx))
}

const makeApi = ctx => ({
  addItem: makeAddItem(ctx),
  fetchItems: makeFetchItems(ctx),
  updateItem: makeUpdateItem(ctx),
  removeItem: makeRemoveItem(ctx),
})

export default {
  bookkeepingAccounts: makeApi('bookkeepingAccounts'),
  defaultAccounts: makeApi('defaultAccounts'),
}
