

const Order = require('../Models/Order')
const Cart = require('../Models/Cart')


class orderController {
    async admin (req, res) {
        try {
            let page = req.query.page
            if ( page <=0 || undefined || null) {
                page = 1
            }
            const pageSize = 10
            const skip = (page - 1) * pageSize
            const totalDocs = await Order.countDocuments({})
            const totalPage = Math.round(totalDocs/pageSize)
            await Order.find({}).skip(skip).limit(pageSize)
            .then(order => res.status(200).json({
                totalPage,
                items: order
            }))
        }
        catch(error) {
            res.status(400).json({error: `Error in orderController: ${error.message}`})
        }
    }

    async getOders(req, res) {
        try {
            await Order.find({userID: req.user._id}).populate('order.productID')
                .then(order => res.status(200).json(order))
        }
        catch(error) {
            res.status(400).json({error: `Error in orderController: ${error.message}`})
        }
    }
    
    async add(req, res) {
        try {
            const newOrder = {
                userID: req.user._id,
                ...req.body
            }
            await Order.create(newOrder)
            .then((order) => {
                order.order.map(async (order)=> {
                    await Cart.findOneAndUpdate({userID: req.user.id}, {$pull: {items: {
                        "_id": order.itemID
                    }}})
                })
                return res.status(200).json(order)
            })
           
        }
        catch(error) {
            res.status(400).json({error: `Error in orderController: ${error.message}`})
        }
    }

}

module.exports = new orderController
 