import f from 'faker'
import { v1 as uuidv1 } from 'uuid'
import { oneOf, randomDateFrom } from '../utils'

const schema = {
  id: { function: uuidv1 },
  role: { function: oneOf(['Sales', 'Developer', 'Tech Lead', 'Assistant']) },
  createdDateTime: { function: randomDateFrom(2012, 0, 1) },
  salary: { faker: 'random.number({"min": 10000, "max": 100000})' },
  fname: { faker: 'name.firstName' },
  lname: { faker: 'name.lastName' },
}

export default schema
