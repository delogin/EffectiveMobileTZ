const {pool, secretJWT} = require('../helpers')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')

exports.addUser = async (req, res, next) => {

    let errors = validationResult(req)
    if (!errors.isEmpty()){
        let error = {}
        error.message = errors
        next(error)
    }

    const hashedPassword = await bcrypt.hash(req.body.userPassword, 10)

    const client = await pool.connect()

    try{
        let result = await client.query(`INSERT INTO users ("FirstName", "MiddleName", "LastName", 
                                                            "userEmail", "birthDate", "userPassword",
                                                            "userRole") 
                                                    values ($1, $2, $3, $4, $5, $6, $7) RETURNING "userId"`, 
        [req.body.FirstName, 
         req.body.MiddleName,
         req.body.LastName,
         req.body.userEmail,
         req.body.birthDate,
         hashedPassword,
         req.body.userRole])
        if (result.rows.length > 0){
            return res.status(201).json({message: "New user created", userId: result.rows[0].userId})
        }   
    }
    catch(err){
        next(err)
    }
    finally{
        client.release()
        console.log("Release client")
    }
}

exports.loginUser = async (req, res, next) => {

    let errors = validationResult(req)
    if (!errors.isEmpty()){
        let error = {}
        error.message = errors
        next(error)
    }

    const client = await pool.connect()
    
    try {
        let result = await client.query(`SELECT "userId", "isActive", "userRole", "userPassword" from users WHERE "userEmail"=$1`, [req.body.userEmail])
        if (result.rows.length > 0){
            if (result.rows[0].isActive){
                const isMatch = await bcrypt.compare(req.body.userPassword,result.rows[0].userPassword )
                if (isMatch){
                    const token = jwt.sign({
                        id: result.rows[0].userId,
                        role: result.rows[0].userRole,
                        },
                        secretJWT,
                        {expiresIn: '24h'}
                    )
                    return res.json({token})
                }
                else{
                    return res.status(403).json({message : "Incorrect email or password"})
                }
            }
            else{
                return res.status(401).json({message : "Account is in block"})
            }
        }
        else{
            return res.status(403).json({message : "Incorrect email or password"})
        }
    }
    catch(err){
        next(err)
    }
    finally{
        client.release()
        console.log("Release client")
    }
}
exports.getUser = async (req, res, next) => {

    const client = await pool.connect()

    try{
        let result = await client.query(`SELECT "userEmail", "FirstName", "MiddleName", 
                                                "LastName", "birthDate", "userRole", 
                                                "isActive" 
                                         FROM users
                                         where "userId"=$1`, [req.body.userId])
        if (result.rows.length > 0){
            return res.json({...result.rows[0]})
        }
        return res.status(403).json({ message: "This account does not exist."})
    }
    catch(err){
        next(err)
    }
    finally{
        client.release()
        console.log("Release client")
    }
}
exports.getAllUsers = async (req, res, next) => {

    const client = await pool.connect()
    try{
        let result = await client.query(`SELECT "userId","userEmail", "FirstName", "MiddleName", 
                                                "LastName", "birthDate", "userRole", 
                                                "isActive"
                                         FROM users
                                         ORDER BY "userId"`)
        return res.json(result.rows)
    }
    catch(err){
        next(err)
    }
    finally{
        client.release()
        console.log("Release client")
    }
}
exports.blockUser = async (req, res, next) => {
    const client = await pool.connect()
    try{
        let result = await client.query(`UPDATE users SET "isActive"=false WHERE "userId"=$1`, [req.body.userId])
        if(result.rowCount > 0){
            return res.json({message: "User successfully blocked", id: req.body.userId})
        }
        return res.status(400).json({ message: "Failed to block user"})
    }   
    catch(err){
        next(err)
    }
    finally{
        client.release()
        console.log("Release client")
    }
}