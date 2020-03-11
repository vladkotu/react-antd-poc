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

export const fetchAccounts = n => {
  return mocker()
    .schema('acc', schema, n)
    .build()
    .then(({ acc }) => acc)
}
