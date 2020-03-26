import express from 'express'
import { checkSchema } from 'express-validator'
import * as utils from '../utils'
import { logger } from '../logger'
import { idValidationSchema, createdDateValidationSchema } from './commonRules'
import * as accountsQueries from '../db/accountsQueries'

const { checkErrors } = utils
const router = express.Router()

const allowedTypes = ['bookkeeping', 'default']

function getAccType(req) {
  const type = req.query.type || req.body.accType
  return type
}

function checkAccountType(req, res, next) {
  const type = getAccType(req)
  if (!allowedTypes.includes(type)) {
    const err = new Error(
      `'accountType' param should have one of ${allowedTypes.join(', ')} values`
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
      const item = await accountsQueries.addAccount({
        accType: type,
        ...req.body,
      })
      res.send(item)
    } catch (err) {
      // logger.error('WERRR', JSON.stringify(err, null, ' '))
      next(err)
    }
  }
)

router.get('/', checkAccountType, async (req, res, next) => {
  try {
    const type = getAccType(req)
    const items = await accountsQueries.fetchAccounts(type)
    res.send(items)
  } catch (err) {
    logger.error(err)
    next(err)
  }
})

router.get(
  '/:id',
  checkSchema(idValidationSchema),
  checkErrors,
  async (req, res, next) => {
    try {
      const item = await accountsQueries.fetchSingleAccount({
        id: req.params.id,
      })
      res.send(item)
    } catch (err) {
      next(err)
    }
  }
)

router.put(
  '/:id',
  checkSchema(idValidationSchema),
  checkErrors,
  async (req, res, next) => {
    try {
      const id = req.params.id
      const item = await accountsQueries.updateAccount({
        id,
        ...req.body,
      })
      res.send(item)
    } catch (err) {
      logger.error(err)
      next(err)
    }
  }
)

router.delete(
  '/:id',
  checkSchema({
    ...idValidationSchema,
  }),
  checkErrors,
  async (req, res, next) => {
    try {
      const id = req.params.id
      await accountsQueries.removeAccount({ id })
      res.send('')
    } catch (err) {
      next(err)
    }
  }
)

export default router
