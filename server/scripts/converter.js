import mocker from 'mocker-data-generator'
import AWS from 'aws-sdk'
import { promises as fs } from 'fs'
import * as path from 'path'
import { isEmptyObj } from '../utils'
import * as schemas from '../schemas'

function stripEmptyAttrs(o) {
  const filtered = Object.entries(o).filter(([k, v]) => {
    return null !== v && undefined !== v && v
  })
  return Object.fromEntries(filtered)
}

async function genData(ctx, schema, n) {
  return mocker()
    .schema(ctx, schema, n)
    .build()
    .then(data => ({
      [ctx]: data[ctx].map(item => ({
        PutRequest: {
          Item: AWS.DynamoDB.Converter.marshall(stripEmptyAttrs(item)),
        },
      })),
    }))
}

;(async function() {
  Object.entries(schemas).forEach(async ([ctx, schema]) => {
    if (isEmptyObj(schema)) {
      return
    }
    const fdata = await genData(ctx, schema, 25)
    const json = JSON.stringify(fdata, null, '  ')
    const fpath = path.join(__dirname, '../../db/', `${ctx}-seed.json`)
    await fs.writeFile(fpath, json, { flag: 'w' })
  })
})()
