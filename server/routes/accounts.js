import express from 'express'
import f from 'faker'
import * as utils from '../utils'

const router = express.Router()

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

const { vatCategoryS, ...defSchema } = schema

const fakeApis = {
  bookkeeping: utils.makeFakeApi('bookkeeping', schema),
  default: utils.makeFakeApi('default', defSchema),
}

const allowedTypes = Object.keys(fakeApis)
const allowedTypesStr = allowedTypes.map(s => `'${s}'`).join(', ')

router.get('/', async (req, res, next) => {
  const type = req.query.accountType
  if (!allowedTypes.includes(type)) {
    res.status(400).json({
      error: {
        msg: `'accountType' param should have one of ${allowedTypesStr} values`,
      },
    })
  } else {
    try {
      res.send({
        type: type,
        items: await fakeApis[type].fetchItems(5),
      })
    } catch (err) {
      next(err)
    }
  }
})

export default router
