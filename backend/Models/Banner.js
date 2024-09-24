const mongoose = require('mongoose')
const Schema = mongoose.Schema

const banner = new Schema({
    name: {type: String, required: true, unique: true},
    image: {type: String}
})

const Banner = mongoose.model('Banner', banner)

module.exports = Banner