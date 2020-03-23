import f from 'faker'
import { v1 as uuidv1 } from 'uuid'
import { randomDate, titleCase } from '../utils'

const oneOf = opts => () => f.random.arrayElement(opts)
const randomDateFrom = (y, m, d) => () =>
  randomDate(new Date(y, m, d), new Date()).getTime()

const schema = {
  id: { function: uuidv1 },
  accType: { function: oneOf(['bookkeeping', 'default']) },
  accNo: { faker: 'random.number({"min": 10, "max": 100})' },
  createdDateTime: { function: randomDateFrom(2012, 0, 1) },
  category: { function: oneOf(['Sales', 'Purchase']) },
  vatPercent: { faker: 'random.number({"min": 1, "max": 100})' },
  vatCategoryS: {
    function: function() {
      return this.object.category.substr(0, 1)
    },
  },
  accName: { function: () => titleCase(f.random.words()) },
  comment: {
    function: function() {
      const len = Math.floor(Math.random() * 13)
      return 0.5 > Math.random(1) ? f.lorem.text(len) : ''
    },
  },
}

export default schema
