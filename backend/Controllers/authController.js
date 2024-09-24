const generateTokenAndSetCookie = require('../utils/generateToken')
const bcrypt = require('bcrypt')

const User = require('../Models/User')
const Cart = require('../Models/Cart')

class authController {
    async register (req, res) {
        try {
            const password = req.body.password
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            const newUser =  {
                ...req.body,
                password : hashPassword
            }
           
            const result =  await User.create(newUser).then(data=> data)
            const cart = await Cart.create({userID: result._id}).then(cart => cart)
            await User.findByIdAndUpdate( cart.userID, {cart: cart._id})
                .then(user => res.status(201).json(user))
                .catch(error => res.json(error))
        }
        catch (error) {
            res.status(409).json({
                status: "fail",
                error: "Tài Khoản đã tồn tại"
            })
        }
    }

    async login (req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({username})
            const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
            if(!user || !isPasswordCorrect) {
                return res.status(400).json({error : "username hoặc password Không đúng"})
            } 
            
            generateTokenAndSetCookie(user._id, res)
          
            res.status(200).json(user)
        } 
        catch (error) {
            res.status(400).json({error: `Error in authController: ${error.message}`})
        }
    }

    async logout (req, res) {
        try {
            res.cookie('jwt', '', {maxAge: 0})
            res.status(400).json({successfull : "Đăng xuất thành công"})
        }
        catch (error) {
            res.status(400).json({error: `Error in authController: ${error.message}`})
        }
    }

    async userInfo (req, res) {
        try {
            res.status(200).json(req.user)
        }
        catch(error) {
            res.status(400).json({error: `Error in authController: ${error.message}`})
        }
    }

    async updateUserInfo (req, res) {
        try {
            const updateUserInfo = {}

            if (req.body.firstName) {
                updateUserInfo.firstName = req.body.firstName
            }
            if (req.body.LastName) {
                updateUserInfo.LastName = req.body.LastName
            }
            if (req.body.email) {
                updateUserInfo.email = req.body.email
            }
            if (req.body.phone) {
                updateUserInfo.phone = req.body.phone
            }
            if (req.body.address) {
                updateUserInfo.address = req.body.address
            }

        
            await User.findOneAndUpdate({_id: req.user.id}, updateUserInfo)
                .catch(error => res.status(404).json({error: "Not Found"}))
            await User.findOne({_id: req.user.id})
                .then(data => res.status(201).json(data))
            }
        
        catch (error) {
            res.status(400).json({error: `Error in authController: ${error.message}`})
        }
    }

}

module.exports = new authController
 