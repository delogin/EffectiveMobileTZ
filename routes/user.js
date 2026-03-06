const express = require('express')
const router = express.Router()
const users = require('../handlers/user')
const {verifyToken, checkAccess, checkAdminAccess} = require('../middleware')
const validate = require('express-jsonschema').validate
const validator = require('express-validator')

router.post('/register',
            validate({
                body:{
                    type: 'object',
                    properties:{
                        FirstName: { type : 'string'},
                        MiddleName: { type : 'string'},
                        LastName: {type: 'string'},
                        userEmail: {type : 'string'},
                        userPassword: {type : 'string'},
                        birthDate: {type : 'string'},
                        userRole : {type : 'string', enum: ['user', 'admin']}
                    },
                    required: ["FirstName", "MiddleName" , "LastName", "userEmail", "userPassword", "birthDate", "userRole"]
                }
            }),
            validator.body('userEmail').isEmail().withMessage('Invalid Email format'),
            users.addUser)
router.post('/login',
            validate({
                body:{
                    type: 'object',
                    properties:{
                        userEmail: {type: 'string'},
                        userPassword: {type: 'string'}
                    },
                    required: ["userEmail", "userPassword"]
                }
            }),
            validator.body('userEmail').isEmail().withMessage('Invalid Email format'),
    users.loginUser)
router.get('/get/all', 
            verifyToken, 
            checkAdminAccess, 
            users.getAllUsers)
router.get('/get', 
            validate({
                body:{
                    type: 'object',
                    properties: {
                        userId: {type : 'integer'}
                    },
                    required: ["userId"]
                }
            }),
            verifyToken, 
            checkAccess, 
            users.getUser)
router.post('/block', 
            validate({
                body:{
                    type: 'object',
                    properties: {
                        userId: {type : 'integer'}
                    },
                    required: ["userId"]
                }
            }),
            verifyToken, 
            checkAccess, 
            users.blockUser)

module.exports = router