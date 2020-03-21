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

module.exports = app
