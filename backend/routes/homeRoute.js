const express = require('express')
const router = express.Router()

const HomeController = require('../Controllers/HomeController')

router.post('/',  HomeController.getPost)

module.exports = router