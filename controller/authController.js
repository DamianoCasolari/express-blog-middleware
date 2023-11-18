const generateJWT =  require("../utilities/generateJWT")


function index(req,res){
   const {username, password} = req.body

if(!username || !password) {
    res.status(400).send("Password and username required ")
}

const users = require("../db/users.json")
let user = users.find((user)=>  user.username == username && user.password == password )
if(!user){
    res.status(401).send("Username e/o password inseriti non corretti")
}

const JWTtoken = generateJWT(user)


res.json({JWTtoken})
}

module.exports = {index}