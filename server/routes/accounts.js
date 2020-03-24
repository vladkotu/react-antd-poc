import express from 'express'
import f from 'faker'
import { checkSchema } from 'express-validator'
import * as utils from '../utils'
import schema from '../schemas/accounts'
import { idValidationSchema, createdDateValidationSchema } from './commonRules'
import * as accountsQueries from '../db/accountsQueries'

const { checkErrors } = utils
const router = express.Router()
const { vatCategoryS, ...defSchema } = schema

const apis = {
  bookkeeping: {
    ...utils.makeFakeApi('bookkeeping', schema),
    addItem: accountsQueries.addAccount,
    fetchSingleAccount: accountsQueries.fetchSingleAccount,
  },
  default: {
    ...utils.makeFakeApi('default', defSchema),
    addItem: accountsQueries.addAccount,
    fetchSingleAccount: accountsQueries.fetchSingleAccount,
  },
}

const allowedTypes = Object.keys(apis)
const allowedTypesStr = allowedTypes.map(s => `'${s}'`).join(', ')

function getAccType(req) {
  const type = req.query.type || req.body.accType
  return type
}

function checkAccountType(req, res, next) {
  const type = getAccType(req)
  if (!allowedTypes.includes(type)) {
    const err = new Error(
      `'accountType' param should have one of ${allowedTypesStr} values`
    )
    err.statusCode = 400
    return next(err)
  }
  return next()
}

router.post(
  '/',
  checkAccountType,
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
      const type = getAccType(req)
      const item = await apis[type].addItem({
        accType: type,
        ...req.body,
      })
      res.send(item)
    } catch (err) {
      next(err)
    }
  }
)

router.get('/', async (req, res, next) => {
  try {
    const {
      query: { limit = 5 },
    } = req
    const type = getAccType(req)
    const items = await apis[type].fetchItems(5)
    res.send({
      count: items.length,
      limit,
      items: items.slice(0, limit),
    })
  } catch (err) {
    next(err)
  }
})

router.get(
  '/:id',
  checkSchema({
    ...idValidationSchema,
    ...createdDateValidationSchema,
  }),
  checkErrors,
  async (req, res, next) => {
    try {
      const item = await accountsQueries.fetchSingleAccount({
        id: req.params.id,
        createdDateTime: req.query.createdDateTime,
      })
      res.send(item)
    } catch (err) {
      next(err)
    }
  }
)

router.put(
  '/:id',
  checkSchema({
    id: {
      in: ['params'],
      errorMessage: 'Id is must have',
    },
    createdDateTime: {
      in: ['body'],
      errorMessage: 'createdDateTime epoch is must have',
    },

    // accNo: {
    //   in: ['body'],
    //   isInt: true,
    //   toInt: true,
    //   errorMessage: 'account number should be number',
    // },
    // category: {
    //   exists: ['Purchase', 'Sale'],
    //   errorMessage: 'should be of onf "Purchase" of "Sale"',
    // },
  }),
  checkErrors,
  async (req, res, next) => {
    try {
      const type = req.query.type
      const id = req.params.id
      const item = await apis[type].updateItem({ id, ...req.body })
      res.send(item)
    } catch (err) {
      next(err)
    }
  }
)

router.delete(
  '/:id',
  checkSchema({
    ...idValidationSchema,
    ...createdDateValidationSchema,
  }),
  checkErrors,
  async (req, res, next) => {
    try {
      const id = req.params.id
      const createdDateTime = req.query.createdDateTime
      await accountsQueries.removeAccount({
        id,
        createdDateTime,
      })
      res.send('')
    } catch (err) {
      next(err)
    }
  }
)

export default router
