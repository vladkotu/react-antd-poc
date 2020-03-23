import express from 'express'
import { checkSchema } from 'express-validator'
import schema from '../schemas/contractors'
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

const idValidationSchema = {
  id: {
    in: ['params'],
    isInt: true,
    toInt: true,
    errorMessage: 'Id is must have',
  },
}

const fakeApi = utils.makeFakeApi('contractors', schema)

router.post(
  '/',
  checkSchema(commonValidationSchema),
  checkErrors,
  async (req, res, next) => {
    try {
      const item = await fakeApi.addItem(req.body)
      res.send(item)
    } catch (err) {
      next(err)
    }
  }
)

router.get('/', async (req, res, next) => {
  try {
    res.send({
      items: await fakeApi.fetchItems(150),
    })
  } catch (err) {
    next(err)
  }
})

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
      const item = await fakeApi.updateItem({ id, ...req.body })
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
  }),
  checkErrors,
  async (req, res, next) => {
    try {
      const id = req.params.id
      const item = await fakeApi.removeItem({ id })
      res.send(item)
    } catch (err) {
      next(err)
    }
  }
)

export default router
