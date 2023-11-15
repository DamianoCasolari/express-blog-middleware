//Import express
const express = require("express")

//Create istance of class Router
const router = express.Router()

//Import Multer pack
const multer = require("multer")

//Import controller for every methods
const PostController = require("../controller/PostsController")

// Define routes GET
router.get("/", PostController.index)
router.get("/create", PostController.create)
router.get("/:slug", PostController.show)
router.get("/:slug/download", PostController.download)

// Define routes POST
router.post("/", multer({dest: "public/imgs/newPosts"}).single("image") , PostController.store)

//Define routes Delete
router.delete("/:slug",PostController.destroy)


// Export module
module.exports = router