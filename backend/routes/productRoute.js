
const express = require('express')
const router = express.Router()

const ProductController = require('../Controllers/ProductController')

router.get('/', ProductController.getProduct)
router.get('/t-shirt', ProductController.getTShirt)
router.get('/trousers', ProductController.getTrousers)
router.get('/search', ProductController.search)
router.get('/category/:slug', ProductController.category)
router.post('/add', ProductController.addProduct)
router.post('/update', ProductController.updateProduct)
router.delete('/delete', ProductController.deleteProduct)
router.get('/:id', ProductController.getProductId)

module.exports = router