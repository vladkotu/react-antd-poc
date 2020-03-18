import f from 'faker'
import { makeFakeApi } from '../utils'
import { BOOKEE, DEFACC } from '../constants'

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

export default {
  [BOOKEE]: makeFakeApi('bookkeepingAccounts', schema),
  [DEFACC]: makeFakeApi('defaultAccounts', schema),
}
