import * as fs from 'fs'
import * as path from 'path'
import f from 'faker'
import { validationResult } from 'express-validator'
import { logger } from './logger'

const sep = ','
export function encodeId({ id, createdDateTime }) {
  const data = `${id}${sep}${createdDateTime}`
  const encoded = Buffer.from(data).toString('base64')
  return encodeURIComponent(encoded)
}

export function decodeId(encoded) {
  const decoded = decodeURIComponent(encoded)
  const [id, createdDateTime] = Buffer.from(decoded, 'base64')
    .toString('utf-8')
    .split(sep)
  return { id, createdDateTime }
}

export function encodeItem(item) {
  const { id, createdDateTime, ...otherAttrs } = item
  return {
    id: encodeId({ id, createdDateTime }),
    ...otherAttrs,
  }
}

export function decodeItem(item) {
  const { id: encoded, ...otherAttrs } = item
  const { id, createdDateTime } = decodeId(encoded)
  return {
    id,
    createdDateTime: parseInt(createdDateTime, 10),
    ...otherAttrs,
  }
}

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

export function readJson(f) {
  const fp = path.join(__dirname, f)
  const cnt = fs.readFileSync(fp, 'utf-8')
  return JSON.parse(cnt)
}

// const logger = {
//   // log: () => {},
//   log: logger.debug,
// }

const isTableExists = async (db, tableName) => {
  try {
    await db.describeTable({ TableName: tableName })
    return true
  } catch (err) {
    const notFoundCode = 'ResourceNotFoundException'
    if (err.code === notFoundCode) {
      return false
    } else {
      throw err
    }
  }
}

const isTableActiveStatus = async (db, tableName) => {
  try {
    const result = await db.describeTable({ TableName: tableName })
    logger.debug(`status: ${result.Table.TableStatus}`)
    return result.Table.TableStatus === 'ACTIVE'
  } catch (err) {
    logger.debug(err)
    return false
  }
}

const delay = async ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

const waitTableActive = async (db, tableName, retries = 5, ms = 1000) => {
  const isActive = await isTableActiveStatus(db, tableName)
  if (isActive) {
    return true
  } else if (retries === 0) {
    throw new Error('Timeout')
  } else {
    await delay(ms)
    return await waitTableActive(db, tableName, retries - 1)
  }
}


const waitTableNotExists = async (db, tableName, retries = 5, ms = 1000) => {
  const isExists = await isTableExists(db, tableName)
  if (!isExists) {
    return true
  } else if (retries === 0) {
    throw new Error('Timeout')
  } else {
    await delay(ms)
    return await waitTableNotExists(db, tableName, retries - 1)
  }
}


export const setupDatabase = async (db, tableName, schema, data) => {
  try {
    const isExists = await isTableExists(db, tableName)
    if (isExists) {
      logger.debug(`${tableName} table already exists, consider removing it`)
      return false
    }
    await db.createTable({
      ...schema,
      TableName: tableName,
    })
    logger.debug(`'${tableName}' - created, wait till active`)
    await waitTableActive(db, tableName, 10, 3000)
    logger.debug(`${tableName} is active`)
    await db.batchWriteItem({
      RequestItems: {
        [tableName]: data,
      },
    })
    logger.debug(`'${tableName}' - seeded`)
  } catch (err) {
    logger.debug(`'${tableName}' - create error`, err)
  }
}

export const tearDownDatabse = async (db, tableName) => {
  try {
    const isExists = await isTableExists(db, tableName)
    if (!isExists) {
      logger.debug(`'${tableName}' would not be removed cause not exists`)
      logger.debug('...skipping')
      return false
    }
    await db.deleteTable({ TableName: tableName })
    logger.debug(`${tableName} table removed, ...waiting`)
    await waitTableNotExists(db, tableName, 10, 800)
    logger.debug(`Done, ${tableName} table removed`)
  } catch (err) {
    logger.debug(`${tableName} no luck`, err)
  }
}
