import config from 'config'
import log4js from 'log4js'

const serverCfg = config.get('server')

log4js.configure({
  appenders: {
    all: { type: 'file', filename: 'logs/all.log' },
  },
  categories: {
    default: { appenders: ['all'], level: serverCfg.logLevel },
  },
})

export const logger = log4js.getLogger('default')

// override for prod
if (process.env.NODE_ENV === 'production') {
  console = {
    info: (...args) => logger.info(...args),
    log: (...args) =>
      logger.debug(...args.map(a => JSON.stringify(a, null, ' '))),
    error: (...args) =>
      logger.error(...args.map(a => JSON.stringify(a, null, ' '))),
  }
}
