
const axios = require('axios')
const crypto = require('crypto');
const Order = require('../Models/Order')
const PaymentQueue = require('../Models/PaymentQueue')

class PaymentController {

    async MoMoPay (req, res) {
        try {
            var requestId = process.env.partnerCode + new Date().getTime();
            var orderId = requestId;
            var orderInfo = req.body.info || "Đơn hàng";
            var redirectUrl = `http://localhost:3000/cart`;
            var ipnUrl = `${process.env.hostName}/payment/callback`;
            var amount = req.body.totalMoney;
            var requestType = "payWithMethod"
            var extraData = ""; //pass empty value if your merchant does not have stores
            var items = []
            let quantityTotal = 0
            const orderList = req.body.order
            orderList.map((item)=> {
                quantityTotal = quantityTotal + item.quantity
                const newItem = {
                    id: item.itemID,  
                    name: item.name,              
                    quantity: item.quantity, 
                    currency: 'VND'
                }
                items.push(newItem)
            })

            var deliveryInfo = {
                "deliveryAddress": req.body.address,
                "deliveryFee": req.body.deliveryFee || 0,
                "quantity": quantityTotal
            } 
            var userInfo = {
                "name": req.body.name,
                "phoneNumber": req.body.phone,
                "email": req.body.email
            }
            
            //before sign HMAC SHA256 with format
            //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
            var rawSignature = "accessKey="+process.env.accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + process.env.partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
            //puts raw signature
            var signature = crypto.createHmac('sha256', process.env.secretkey)
                .update(rawSignature)
                .digest('hex');

            //json object send to MoMo endpoint
            const requestBody = JSON.stringify({
                partnerCode : process.env.partnerCode,
                accessKey : process.env.accessKey,
                requestId : requestId,
                amount : amount,
                orderId : orderId,
                orderInfo : orderInfo,
                redirectUrl : redirectUrl,
                ipnUrl : ipnUrl,
                extraData : extraData,
                requestType : requestType,
                signature : signature, 
                items,
                deliveryInfo,
                userInfo,
                lang: 'vi'
            });

            const options = {
                method: "POST",
                url: 'https://test-payment.momo.vn/v2/gateway/api/create',
                headers: {
                    'Content-Type': "application/json",
                    'Content-Length': Buffer.byteLength(requestBody)
                },
                data: requestBody

            }
            
            const result = await axios(options)
            res.status(200).json(result.data)
        }
        catch (error) {

        }
        
    }

    async callback (req, res) {
        fetch(`${process.env.hostName}/payment/transaction-status`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(req.body)
        })
            .then(result => {
                res.json(result)
            })
    }

    async transactionStatus (req, res) {
        
        const {orderId} = req.body

        const rawSignature = `accessKey=${process.env.accessKey}&orderId=${orderId}&partnerCode=${process.env.partnerCode}&requestId=${orderId}`
        const signature = crypto.createHmac("sha256", process.env.secretkey).update(rawSignature).digest('hex')

        const requestBody = JSON.stringify({
            partnerCode: process.env.partnerCode,
            requestId: orderId,
            orderId,
            signature,
            lang: 'vi'
        })

        const options = {
            method: "POST",
            url: 'https://test-payment.momo.vn/v2/gateway/api/query',
            headers : {
                'Content-Type' : 'application/json'
            },
            data: requestBody
        }

        try {
            const result = await axios(options)
            const { resultCode, orderId } = result.data
            if ( resultCode === 0 ) {
                await PaymentQueue.findOneAndDelete({orderId: orderId})
                    .then(async order => {
                        const newOrder = {
                            userID: order.userID,
                            name: order.name,
                            email: order.email,
                            phone: order.phone,
                            address: order.address,
                            totalMoney: order.totalMoney,
                            order: order.order
                        }
                        
                        await Order.create(newOrder) 
                        
                    })
            }

            res.status(200).json(result.data)
        }
        catch (error) {
            res.status(500).json({
                error: error.message
            })
        }
    }
    
}

module.exports = new PaymentController
 