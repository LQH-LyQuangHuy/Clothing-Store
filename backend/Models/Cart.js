const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cart = new Schema({
    userID: {type: Schema.ObjectId,ref: "User", required: true, unique: true},
    items: [
        {
            productId: {type: Schema.ObjectId, ref : "Product"},
            quantity: {type: Number},
            size: {type : String}
        }
    ]
})

const Cart = mongoose.model('Cart', cart)

module.exports = Cart