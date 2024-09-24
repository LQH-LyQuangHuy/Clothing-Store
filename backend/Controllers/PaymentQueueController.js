

const PaymentQueue = require('../Models/PaymentQueue')
const Cart = require('../Models/Cart')


class PaymentQueueController {

    async add(req, res) {
        try {
            
            const newOrder = {
                userID: req.user._id,
                ...req.body
            }
            
            await PaymentQueue.create(newOrder)
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
            res.status(400).json({error: `Error in PaymentQueueController: ${error.message}`})
        }
    }

}

module.exports = new PaymentQueueController
 