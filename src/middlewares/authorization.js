const jwt = require('jsonwebtoken')
const secret = process.env.SECRET_JWT
//const secret = "opciones"

module.exports = (req, res, next) => {
    
    const token = req.header('x-auth-token')

    if(!token){
        return res.status(401).json({
            msg: "No hay token, permiso no valido"
        })
    }

    try {
        
        const openToken = jwt.verify(token, secret)

        req.user = openToken.userId

        next()

    } catch (error) {
        
        res.json({
            msg: "Hubo un error",
            error
        })
    }
}