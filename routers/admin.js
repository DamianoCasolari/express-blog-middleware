const express = require("express")
const adminController = require("../controller/adminController")
const authentication = require("../middlewares/authentication")
const router = express.Router()

router.use(authentication)

router.get("/",adminController.index)

module.exports = router