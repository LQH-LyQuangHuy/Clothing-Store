


const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const Schema = mongoose.Schema

const product = new Schema({
    name: {type: String },
    slug : {type: String, slug: "name"},
    price: {type: Number, required: true },
    description: {type: String, required: true},
    thumbnail: {type: Array, required: true, default: []},
    category : {type: Array, required : true, default: []},
    sale : {type: Number, default: null},
    size : {type: Array, default: []},
    star : {type: Number, default: 4.5},
},
{
    timestamps: true
}
)

const Product = mongoose.model('Product', product)

module.exports = Product