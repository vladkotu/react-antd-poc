import mocker from 'mocker-data-generator'
import f from 'faker'

const schema = {
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
const items = () => JSON.parse(localStorage.getItem('accounts'))
const store = ix => localStorage.setItem('accounts', JSON.stringify(ix))

export const fetchAccounts = n => {
  const as = items()
  if (as && as.length) return as
  else
    return mocker()
      .schema('acc', schema, n)
      .build()
      .then(({ acc }) => {
        store(acc)
        return acc
      })
}

export const removeAccount = remNo => {
  store(items().filter(({ accNo }) => remNo !== accNo))
  return Promise.resolve(items())
}

export const addAccount = acc => {
  store([acc, ...items()])
  return Promise.resolve(items())
}

export const editAccount = acc => {
  const as = items()
  const idx = as.findIndex(a => a.accNo === acc.accNo)
  as[idx] = acc
  store(as)
  return Promise.resolve(items())
}
