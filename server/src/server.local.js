#!/usr/bin/env node

import AWS from 'aws-sdk'
import http from 'http'
import config from 'config'
import { logger } from './logger'
import app from './app'

const dbCfg = config.get('ddb')
const serverCfg = config.get('server')

AWS.config.update({
  region: dbCfg.region,
  endpoint: dbCfg.endpoint,
})

const port = serverCfg.port

app.set('port', port)

const server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  logger.info('Listening on ' + bind)
}
