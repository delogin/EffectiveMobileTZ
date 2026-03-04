const express = require('express')
const router = express.Router()
const users = require('../handlers/user')
const {verifyToken, checkAccess} = require('../middleware')

router.post('/register', users.addUser)
router.post('/login', users.loginUser)

module.exports = router