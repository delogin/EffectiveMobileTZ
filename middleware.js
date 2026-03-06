const {pool, secretJWT} = require("./helpers")
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.header('Access')
    if (!token){
        res.status(401)
        return res.json({ message: "You are not autorized" })
    }

    jwt.verify(token, secretJWT, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = decoded; 
        next();
    });
}

const checkAccess = async (req, res, next) => {
    if (req.user.id != req.body.userId && req.user.role!=2){
        return res.status(403).json({message: "Access denied"})
    }

    const client = await pool.connect()
    
    try{
        let result = await client.query(`SELECT "userId", 
                                                "isActive" 
                                         FROM users 
                                         WHERE "userId" = $1`, [req.user.id])
        if (result.rows.length > 0 && result.rows[0].isActive){
            next()
        }
        else{
            return res.status(403).json({ message: "Account is in block or delete"})
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
const checkAdminAccess = async (req, res, next) => {
    if (req.user.role!=2){
        return res.status(403).json({message: "Access denied"})
    }

    const client = await pool.connect()
    
    try{
        let result = await client.query(`SELECT "userId", 
                                                "isActive",
                                                "userRole"
                                         FROM users 
                                         WHERE "userId" = $1`, [req.user.id])
        if (result.rows.length > 0 && result.rows[0].isActive && result.rows[0].userRole == 2){
            next()
        }
        else{
            return res.status(403).json({ message: "Access denied"})
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

module.exports = {
    verifyToken      : verifyToken,
    checkAccess      : checkAccess,
    checkAdminAccess : checkAdminAccess,
}