const express = require('express')
const router = express.Router()
const { authenticator } = require('../middleware/auth')

const home = require('./modules/home')
const category = require('./modules/category')
const records = require('./modules/records')
const users = require('./modules/users')
const auth = require('./modules/auth')

router.use('/auth', auth)
router.use('/users', users)
router.use('/records', authenticator, records)
router.use('/category', authenticator, category)
router.use('/', authenticator, home)

module.exports = router