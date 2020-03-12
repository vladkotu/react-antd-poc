import mocker from 'mocker-data-generator'
import f from 'faker'

const randomId = (from, to, exclude = [], retries = 10) => {
  const id = f.random.number({ min: from, max: to })
  if (-1 === exclude.indexOf(id)) {
    return id
  } else if (0 === retries) {
    return undefined
  } else {
    randomId(from, to, exclude, --retries)
  }
}

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
const getItems = () => JSON.parse(localStorage.getItem('accounts'))
const storeItems = ix => localStorage.setItem('accounts', JSON.stringify(ix))

export const fetchItems = (n = 3) => {
  const accounts = getItems()
  if (accounts && accounts.length) return accounts
  else
    return mocker()
      .schema('acc', schema, n)
      .build()
      .then(({ acc }) => {
        storeItems(acc)
        return acc
      })
}

export const removeItem = account => {
  storeItems(getItems().filter(({ id }) => account.id !== id))
  return Promise.resolve(getItems())
}

export const addItem = acc => {
  const currentItems = getItems()
  acc.id = randomId(
    10,
    1000,
    currentItems.map(i => i.id)
  )
  storeItems([acc, ...currentItems])
  return Promise.resolve(getItems())
}

export const updateItem = acc => {
  const accounts = getItems()
  const idx = accounts.findIndex(a => a.id === acc.id)
  accounts[idx] = acc
  storeItems(accounts)
  return Promise.resolve(getItems())
}
