const express = require("express")
const adminController = require("../controller/adminController")
const router = express.Router()


router.get("/",adminController.index)

module.exports = router