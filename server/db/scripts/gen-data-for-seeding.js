import mocker from 'mocker-data-generator'
import AWS from 'aws-sdk'
import { promises as fs } from 'fs'
import { v1 as uuidv1 } from 'uuid'
import * as path from 'path'
import { stripEmptyAttrs } from '../../utils'
import * as schemas from '../schemas'

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

export async function genStoreSeedData() {
  Object.entries(schemas).forEach(async ([ctx, schema]) => {
    const fdata = await genData(ctx, schema, 5)
    console.log(`Generate data for ${ctx}`)
    const json = JSON.stringify(fdata, null, '  ')
    const uuid = uuidv1()
    const fpath = path.join(__dirname, '../', `${ctx}DataSeed${uuid}.json`)
    console.log(`Store data to ${fpath}`)
    await fs.writeFile(fpath, json, { flag: 'w' })
  })
}
