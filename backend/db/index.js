const mongoose =require('mongoose')

const compassURL = 'mongodb://127.0.0.1:27017/shop'

function connect() {
    try {
        mongoose.connect(compassURL)
        console.log('connect successfull!')

    }
    catch (error) {
        console.log('connect fail!')
    }
}

module.exports = {connect}