import express from 'express'
import { checkSchema } from 'express-validator'
import schema from '../schemas/contractors'
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

const api = {
  ...utils.makeFakeApi('contractors', schema),
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
    res.send({
      items: await api.fetchItems(150),
    })
  } catch (err) {
    next(err)
  }
})

router.get(
  '/:id',
  checkSchema({ ...idValidationSchema, ...createdDateValidationSchema }),
  checkErrors,
  async (req, res, next) => {
    try {
      const id = req.params.id
      const createdDateTime = req.query.createdDateTime
      const item = await contractorsQueries.fetchSingleContractor({
        id,
        createdDateTime,
      })
      res.send(item)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

router.put(
  '/:id',
  checkSchema({
    ...commonValidationSchema,
    ...idValidationSchema,
  }),
  checkErrors,
  async (req, res, next) => {
    try {
      const id = req.params.id
      const item = await api.updateItem({ id, ...req.body })
      res.send(item)
    } catch (err) {
      next(err)
    }
  }
)

router.delete(
  '/:id',
  checkSchema({ ...idValidationSchema, ...createdDateValidationSchema }),
  checkErrors,
  async (req, res, next) => {
    try {
      const id = req.params.id
      const createdDateTime = req.query.createdDateTime
      await contractorsQueries.removeContractor({
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
