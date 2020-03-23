import express from 'express'
import f from 'faker'
import { checkSchema } from 'express-validator'
import * as utils from '../utils'
import schema from '../schemas/accounts'

const { checkErrors } = utils
const router = express.Router()

const { vatCategoryS, ...defSchema } = schema

const fakeApis = {
  bookkeeping: utils.makeFakeApi('bookkeeping', schema),
  default: utils.makeFakeApi('default', defSchema),
}

const allowedTypes = Object.keys(fakeApis)
const allowedTypesStr = allowedTypes.map(s => `'${s}'`).join(', ')

router.use(function checkAccountType(req, res, next) {
  const type = req.query.accountType
  if (!type) {
    return next()
  }
  if (!allowedTypes.includes(type)) {
    const err = new Error(
      `'accountType' param should have one of ${allowedTypesStr} values`
    )
    err.statusCode = 400
    return next(err)
  }
  return next()
})

router.post(
  '/',
  checkSchema({
    accNo: {
      in: ['body'],
      isInt: true,
      toInt: true,
      errorMessage: 'account number should be number',
    },
    category: {
      exists: ['Purchase', 'Sale'],
      errorMessage: 'should be of onf "Purchase" of "Sale"',
    },
  }),
  checkErrors,
  async (req, res, next) => {
    try {
      const type = req.query.type
      const item = await fakeApis[type].addItem(req.body)
      res.send(item)
    } catch (err) {
      next(err)
    }
  }
)

router.get('/', async (req, res, next) => {
  try {
    const {
      query: { type, limit = 5 },
    } = req
    const items = await fakeApis[type].fetchItems(5)
    res.send({
      count: items.length,
      limit,
      items: items.slice(0, limit),
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const {
      query: { type },
    } = req
    const items = await fakeApis[type].fetchItems()
    const item = items.find(i => i.id === parseInt(req.params.id, 10))
    res.send(item)
  } catch (err) {
    next(err)
  }
})

router.put(
  '/:id',
  checkSchema({
    id: {
      in: ['params'],
      isInt: true,
      toInt: true,
      errorMessage: 'Id is must have',
    },
    accNo: {
      in: ['body'],
      isInt: true,
      toInt: true,
      errorMessage: 'account number should be number',
    },
    category: {
      exists: ['Purchase', 'Sale'],
      errorMessage: 'should be of onf "Purchase" of "Sale"',
    },
  }),
  checkErrors,
  async (req, res, next) => {
    try {
      const type = req.query.type
      const id = parseInt(req.params.id, 10)
      const item = await fakeApis[type].updateItem({ id, ...req.body })
      res.send(item)
    } catch (err) {
      next(err)
    }
  }
)

router.delete(
  '/:id',
  checkSchema({
    id: {
      in: ['params'],
      isInt: true,
      toInt: true,
      errorMessage: 'Id is must have',
    },
  }),
  checkErrors,
  async (req, res, next) => {
    try {
      const type = req.query.type
      const id = parseInt(req.params.id, 10)
      await fakeApis[type].removeItem({ id, ...req.body })
      res.send({ ok: true })
    } catch (err) {
      next(err)
    }
  }
)

export default router
