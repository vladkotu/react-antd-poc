import express from 'express'
import { checkSchema } from 'express-validator'
import { logger } from '../logger'
import { idValidationSchema, createdDateValidationSchema } from './commonRules'
import * as contractorsQueries from '../db/contractorsQueries'
import * as utils from '../utils'

const { checkErrors } = utils
const router = express.Router()

const commonValidationSchema = {
  role: {
    exists: ['Sales', 'Developer', 'Tech Lead', 'Assistant'],
  },
  salary: {
    isLength: {
      min: 10000,
      max: 100000,
    },
    isInt: true,
    toInt: true,
  },
}

router.post(
  '/',
  checkSchema(commonValidationSchema),
  checkErrors,
  async (req, res, next) => {
    try {
      const item = await contractorsQueries.addContractor(req.body)
      res.send(item)
    } catch (err) {
      next(err)
    }
  }
)

router.get('/', async (req, res, next) => {
  try {
    const items = await contractorsQueries.fetchContractors()
    res.send(items)
  } catch (err) {
    logger.error(err)
    next(err)
  }
})

router.get(
  '/:id',
  checkSchema({ ...idValidationSchema }),
  checkErrors,
  async (req, res, next) => {
    try {
      const id = req.params.id
      const item = await contractorsQueries.fetchSingleContractor({
        id,
      })
      res.send(item)
    } catch (err) {
      logger.error(err)
      next(err)
    }
  }
)

router.put(
  '/:id',
  checkSchema({
    ...idValidationSchema,
  }),
  checkErrors,
  async (req, res, next) => {
    try {
      const id = req.params.id
      const item = await contractorsQueries.updateContractor({
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
  checkSchema({ ...idValidationSchema }),
  checkErrors,
  async (req, res, next) => {
    try {
      const id = req.params.id
      await contractorsQueries.removeContractor({
        id,
      })
      res.send('')
    } catch (err) {
      logger.error(err)
      next(err)
    }
  }
)

export default router
