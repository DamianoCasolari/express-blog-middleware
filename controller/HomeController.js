const express = require("express")
const path = require("path")
const fs = require("fs")

const app = express()

const pathIndexHtml = path.resolve("index.html")

function home(req,res) {

    const HomePageHtml = fs.readFileSync(pathIndexHtml, "utf-8")
    res.send(HomePageHtml)
    
}

module.exports = home