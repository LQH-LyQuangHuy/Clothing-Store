const mongoose = require('mongoose')
const Schema = mongoose.Schema

const order = new Schema({
    userID: {type: Schema.ObjectId, ref: "User", required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    address: {type: String, required: true},
    totalMoney: {type: Number, required: true},
    order: [{
            itemID: {type: Schema.ObjectId},
            productID: {type: Schema.ObjectId, ref: "Product"},
            name: {type: String},
            size: {type: String},
            quantity: {type: Number},
        }]
    
})

const Order = mongoose.model('Order', order)

module.exports = Order