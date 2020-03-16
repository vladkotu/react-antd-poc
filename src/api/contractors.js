import f from 'faker'
import { makeFakeApi } from '../utils'

const schema = {
  id: { faker: 'random.number({"min": 10, "max": 100})' },
  role: {
    function: () =>
      f.random.arrayElement(['Sales', 'Developer', 'Tech Lead', 'Assistant']),
  },
  salary: { faker: 'random.number({"min": 10000, "max": 100000})' },
  fname: { faker: 'name.firstName' },
  lname: { faker: 'name.lastName' },
}

export default makeFakeApi('contractors', schema)
