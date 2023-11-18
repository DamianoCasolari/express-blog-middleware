const path = require("path")
const fs = require("fs")

const pathIndexHtml = path.resolve("index.html")

function home(req,res) {
    
    const HomePageHtml = fs.readFileSync(pathIndexHtml, "utf-8")
    res.send(HomePageHtml)
    
}

module.exports = home