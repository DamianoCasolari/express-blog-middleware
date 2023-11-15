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

// create istance of express 
const app = express()

// configure static files
app.use(express.static("public"))
app.use(express.static("css"))

// configure body-parser for "application/json" 
app.use(express.json());

// configure body-parser for "application/x-www-form-urlencoded" 
app.use(express.urlencoded({ extended: true }));


// Crete routes GET
app.get("/", HomeController)
app.use("/posts", PostController)

// Create routes POST
app.post("/", PostController)

// Bind server with a PORT
app.listen(3000, console.log("Create server correctly = http://localhost:3000"))