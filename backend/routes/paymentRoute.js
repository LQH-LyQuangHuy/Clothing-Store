const express = require('express')
const router = express.Router()

const protectRoute = require('../midleware/protectRoute')
const PaymentController = require('../Controllers/PaymentController')


router.post('/momo',  PaymentController.MoMoPay)
router.post('/callback',  PaymentController.callback)
router.post('/transaction-status',  PaymentController.transactionStatus)




module.exports = router