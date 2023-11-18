const jwt = require("jsonwebtoken")

module.exports = function (req,res,next){

    let token = req.header("Authorization")
    if(!token) {
        res.status(401).send("You are not authorized to this section")
    }
    token = token.slice(7)

    const jwtpayload = jwt.verify(token,process.env.JWT_SECRET)
    
    req.user = jwtpayload

next()
}