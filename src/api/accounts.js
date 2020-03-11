import mocker from 'mocker-data-generator'
import f from 'faker'

const schema = {
  accNo: { faker: 'finance.account' },
  category: {
    function: () => f.random.arrayElement(['Sales', 'Purchase']),
  },
  vatPercent: { faker: 'random.number' },
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

export const getAccounts = n => {
  return mocker()
    .schema('acc', schema, n)
    .build()
    .then(({acc}) => acc)
}