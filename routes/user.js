const express = require('express')
const router = express.Router()
const users = require('../handlers/user')
const {verifyToken, checkAccess, checkAdminAccess} = require('../middleware')

router.post('/register', users.addUser)
router.post('/login', users.loginUser)
router.get('/get/all', verifyToken, checkAdminAccess, users.getAllUsers)
router.get('/get', verifyToken, checkAccess, users.getUser)
router.post('/block', verifyToken, checkAccess, users.blockUser)

module.exports = router