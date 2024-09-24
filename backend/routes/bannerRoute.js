const express = require('express')
const router = express.Router()

const BannerController = require('../Controllers/BannerController')

router.get('/',  BannerController.getBanner)
router.post('/add',  BannerController.add)
router.post('/update',  BannerController.update)

module.exports = router