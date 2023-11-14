const express = require("express")
const router = express.Router()
const PostController = require("../controller/PostsController")


router.get("/", PostController.index)
router.get("/create", PostController.create)
router.get("/:slug", PostController.show)
router.get("/:slug/download", PostController.download)


module.exports = router