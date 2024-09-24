const express = require('express')
const router = express.Router()

const protectRoute = require('../midleware/protectRoute')
const PaymentQueueController = require('../Controllers/PaymentQueueController')


router.post('/',protectRoute,  PaymentQueueController.add)





module.exports = router