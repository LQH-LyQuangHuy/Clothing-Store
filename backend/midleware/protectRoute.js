const jwt = require('jsonwebtoken')
const User = require('../Models/User')

async function protectRoute (req, res, next) {
    try {
        const token = req.cookies.jwt
        
        if (!token) {
            return res.status(400).json({error: "No token Provider"})
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRECT)

        if (!decoded) {
            return res.status(400).json({error: "Invalid token "})
        }

        const user = await User.findOne({_id: decoded.userId}).select("-password")

        if (!user) {
            return res.status(404).json({error: "User not found"})
        }
        req.user = user
        next()
    }
    catch (error) {
        console.log("Error in protectRoute midlewares: ", error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

module.exports = protectRoute