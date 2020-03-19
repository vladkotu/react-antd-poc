var express = require('express')
var router = express.Router()
var usersRouter = require('./users')
var accountsRouter = require('./accounts')

router.use('/users', usersRouter)
router.use('/accounts', accountsRouter)

module.exports = router
