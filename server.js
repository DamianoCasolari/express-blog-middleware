// import built-in and external pack 
const express = require("express")
const dotenv = require("dotenv")
const path = require("path")
const fs = require("fs")

//configure external pack
dotenv.config()

// import local files
const HomeController = require("./controller/HomeController.js")
const PostController = require("./routers/posts.js")
const adminController = require("./routers/admin.js")
const authController = require("./routers/auth.js")

const errorsFormatterMiddleware = require("./middlewares/errorsFormatter.js")
const routeNotFound = require("./middlewares/routeNotFound.js")
// const generateJwt = require("./utilities/generateJwt.js")

// create istance of express 
const app = express()

// configure static files
app.use(express.static("public"))
app.use(express.static("css"))

// configure body-parser for "application/json" 
app.use(express.json());

// configure body-parser for "application/x-www-form-urlencoded" 
app.use(express.urlencoded({ extended: true }));

// Crete single routes
app.get("/", HomeController)
app.post("/login",(req,res)=> {
    const token = generateJwt()
    res.json({token})
})
// Crete single routers (with multi-routes inside)
app.use("/posts", PostController)
app.use("/admin",adminController)
app.use("/auth",authController)

//Menage page 404 routes not found 
app.use(routeNotFound)

//Menage Errors Middleware
app.use(errorsFormatterMiddleware)

// Bind server with a PORT
app.listen(3000, console.log("Create server correctly = http://localhost:3000"))