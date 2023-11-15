//Import express
const express = require("express")

//Create istance of class Router
const router = express.Router()

//Import controller for every methods
const PostController = require("../controller/PostsController")

// Define routes GET
router.get("/", PostController.index)
router.get("/create", PostController.create)
router.get("/:slug", PostController.show)
router.get("/:slug/download", PostController.download)

// Define routes POST
router.post("/",PostController.store)

// Export module
module.exports = router