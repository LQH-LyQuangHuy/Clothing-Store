const express = require('express')
const router = express.Router()

const protectRoute = require('../midleware/protectRoute')
const orderController = require('../Controllers/orderController')


router.get('/', protectRoute,  orderController.getOders)
router.post('/add', protectRoute,  orderController.add)
router.get('/admin', protectRoute,  orderController.admin)



module.exports = router