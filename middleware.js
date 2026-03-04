const {pool, secretJWT} = require("./helpers")
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.headers['autorization']

    if (!token){
        res.status(401)
        return res.json({ message: "Вы не авторизованы" })
    }

    jwt.verify(token, secretJWT, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Токен недействителен" });
        req.user = decoded; 
        next();
    });
}

const checkAccess = async (req, res, next) => {
    if (req.user.id != req.body.id && req.role!=2){
        return res.status(403).json({message: "Не достаточно прав"})
    }

    const client = await pool.connect()
    
    try{
        let result = await client.query(`SELECT "userId", 
                                                "isActive" 
                                         FROM users 
                                         WHERE userId = $1`, [req.user.id])
        if (result.rows.length > 0 && result.rows[0].isActive){
            next()
        }
        return res.status(403).json({ message: "Аккаунт заблокирован или удален"})
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
    verifyToken : verifyToken,
    checkAccess : checkAccess
}