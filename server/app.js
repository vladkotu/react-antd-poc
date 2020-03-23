import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import pretty from 'express-prettify'
import indexRouter from './routes/index'

const app = express()

app.use(pretty({ query: 'pretty' }))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../client/build')))

app.use('/api', indexRouter)

app.use(function(req, res, next) {
  const err = new Error(`Cannot find url ${req.url}`)
  err.statusCode = 404
  return next(err)
})

app.use(function(err, req, res, next) {
  res.status(err.statusCode || 500)
  const jsonErr = { status: res.status, error: err.message, stack: err.stack }
  res.format({
    json: function() {
      res.send(jsonErr)
    },
    html: function() {
      res.type('html').send(JSON.stringify(jsonErr, null, ' '))
    },
    default: function() {
      res.type('txt').send('Not found')
    },
  })
})

module.exports = app
