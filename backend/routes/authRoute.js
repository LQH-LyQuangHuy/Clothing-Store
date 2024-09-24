const express = require('express')
const router = express.Router()

const authController = require('../Controllers/authController')
const protectRoute = require('../midleware/protectRoute')

router.post('/login',  authController.login)
router.get('/logout',  authController.logout)
router.post('/register',  authController.register)
router.get('/user', protectRoute, authController.userInfo)
router.patch('/update-userInfo', protectRoute, authController.updateUserInfo)

module.exports = router