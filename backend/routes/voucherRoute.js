const express = require('express')
const router = express.Router()

const VoucherController = require('../Controllers/VoucherController')

router.get('/',  VoucherController.getVoucher)
router.post('/add',  VoucherController.add)
router.patch('/update/:id',  VoucherController.update)
router.delete('/delete/:id',  VoucherController.delete)
router.get('/admin',  VoucherController.admin)

module.exports = router