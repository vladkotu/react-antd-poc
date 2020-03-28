import AWS from 'aws-sdk'

AWS.config.update({
  region: 'eu-west-2',
  endpoint: 'http://localhost:4569',
})

function wrapObj(obj, methods) {
  for (let method in obj) {
    if (methods.includes(method)) {
      obj[method] = promisify(obj, obj[method])
    }
  }
  return obj
}

function promisify(ctx, f) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      function callback(err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
      args.push(callback)
      f.call(ctx, ...args)
    })
  }
}

let ddbInstance = null
export function ddbCli() {
  if (ddbInstance) {
    return ddbInstance
  }
  ddbInstance = wrapObj(new AWS.DynamoDB(), [
    'listTables',
    'createTable',
    'deleteTable',
    'batchGetItem',
    'batchWriteItem',
    'describeTable',
  ])
  return ddbInstance
}

let docClient
export function ddbDoc() {
  if (docClient) {
    return docClient
  }
  docClient = wrapObj(new AWS.DynamoDB.DocumentClient(), [
    'put',
    'get',
    'update',
    'delete',
    'query',
    'scan',
  ])
  return docClient
}
