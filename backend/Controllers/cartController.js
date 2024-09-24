const generateTokenAndSetCookie = require('../utils/generateToken')
const bcrypt = require('bcrypt')

const Cart = require('../Models/Cart')

class cartController {
    async cart (req, res) {
        try {
           await Cart.findOne({userID: req.user._id}).populate('items.productId').populate('userID')
            .then(cart =>  res.status(200).json(cart))
        
        }
        catch(error) {
            res.status(400).json({error: error.message})
        }
    }

    async addProduct (req, res) {
        try {
            
            await Cart.findOneAndUpdate(
                {
                    userID: req.user._id,
                    "items.productId": req.body.productId,
                    "items.size": req.body.size
                },
                {
                    $inc: { "items.$[elem].quantity": req.body.quantity } 
                },
                { 
                    arrayFilters: [{ "elem.productId": req.body.productId, "elem.size": req.body.size }] ,
                    new: true 
                }
            )
            
            .then(async(cart) => {
                if(!cart) {
                    await Cart.findOneAndUpdate({userID: req.user.id}, {$push: {items: req.body}}, {new: true})
                    .then(cart=> {
                        res.status(201).json(cart)
                    })
                    return
                }
                res.status(201).json(cart)
            })
            
        }
        catch (error) {
            res.status(400).json({error: `Error in cartController: ${error.message}`})
        }
    }   

    async decQuantityItem (req, res) {
        try {
            await Cart.findOneAndUpdate(
                {
                    userID: req.user._id,
                    "items.productId": req.body.productId
                },
                {
                    $inc: { "items.$[elem].quantity": -1 } 
                },
                {
                    arrayFilters: [{ "elem.productId": req.body.productId, "elem.size": req.body.size }] ,
                    new: true 
                }
            )
            .then(cart=> res.status(201).json(cart))
        }
        catch (error) {
            res.status(400).json({error: `Error in cartController: ${error.message}`})
        }
    }

    async delete (req, res) {
        try {
            await Cart.findOneAndUpdate({userID: req.user.id}, {$pull: {items: {
                "_id": req.params.id
            }}})
            .then(item=> res.status(201).json(item)) 
        }
        catch (error) {
            res.status(400).json({error: `Error in cartController: ${error.message}`})
        }
    }
} 

module.exports = new cartController
 