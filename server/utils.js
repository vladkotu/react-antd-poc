import f from 'faker'
import { validationResult } from 'express-validator'

export const checkErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  next()
}

export function titleCase(string) {
  return string
    .toLowerCase()
    .split(' ')
    .map(s => {
      return s[0].toUpperCase() + s.slice(1)
    })
    .join(' ')
}

export function isEmptyObj(o) {
  return Object.keys(o).length === 0 && o.constructor === Object
}

export function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

export function stripEmptyAttrs(o) {
  const filtered = Object.entries(o).filter(([k, v]) => {
    return null !== v && undefined !== v && v
  })
  return Object.fromEntries(filtered)
}

export const oneOf = opts => () => f.random.arrayElement(opts)

export const randomDateFrom = (y, m, d) => () =>
  randomDate(new Date(y, m, d), new Date()).getTime()
