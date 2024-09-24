const mongoose = require('mongoose')
const Schema = mongoose.Schema

const voucher = new Schema({
    code: {type: String, required: true, unique: true},
    discount: {type: Number, required: true},
    description: {type: String, required: true},
    startTime: {type: String, required: true},
    endTime: {type: String, required: true},
})

const Voucher = mongoose.model('Voucher', voucher)

module.exports = Voucher