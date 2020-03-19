import express from 'express'
import f from 'faker'
import * as utils from '../utils'

const router = express.Router()

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

const fakeApi = utils.makeFakeApi('contractors', schema)

router.get('/', async (req, res, next) => {
  try {
    res.send({
      items: await fakeApi.fetchItems(15),
    })
  } catch (err) {
    next(err)
  }
})

export default router
