const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user = new Schema({
    firstName: {type: String, required: true},
    LastName: {type: String, required: true},
    username: {type: String, required: true, unique : true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    age: {type: Number},
    role: {type: String, enum: ['client', 'admin'], default: "client"},
    address: {type: String, required: true},
    cart: {type: Schema.ObjectId, ref : "Cart" },
})

const User = mongoose.model('User', user)

module.exports = User