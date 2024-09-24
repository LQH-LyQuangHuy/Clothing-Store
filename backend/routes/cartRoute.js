const express = require('express')
const router = express.Router()

const protectRoute = require('../midleware/protectRoute')
const cartController = require('../Controllers/cartController')


router.get('/', protectRoute,  cartController.cart)
router.post('/add', protectRoute,  cartController.addProduct)
router.patch('/decquantityitem', protectRoute,  cartController.decQuantityItem)
router.delete('/delete/:id', protectRoute,  cartController.delete)


module.exports = router