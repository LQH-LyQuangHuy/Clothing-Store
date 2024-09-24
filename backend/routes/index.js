
const productRoute = require('./productRoute')
const authRoute = require('./authRoute')
const bannerRoute = require('./bannerRoute')
const voucherRoute = require('./voucherRoute')
const cartRoute = require('./cartRoute')
const orderRoute = require('./orderRoute')
const paymentRoute = require('./paymentRoute')
const paymentQueueRoute = require('./PaymentQueueRoute')

function routes(app) {
    app.use('/product', productRoute)
    app.use('/banner', bannerRoute)
    app.use('/voucher', voucherRoute)
    app.use('/cart', cartRoute)
    app.use('/order', orderRoute) 
    app.use('/payment', paymentRoute)
    app.use('/payment-queue', paymentQueueRoute)
    app.use('/auth', authRoute)
} 

module.exports = routes