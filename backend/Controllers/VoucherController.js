const Voucher = require('../Models/Voucher')

class VoucherController {

    // [GET]/
    async getVoucher (req, res) {
        try {
            await Voucher.find({}).sort({createdAt: -1}).limit(5)
                .then(data => res.status(200).json(data))
                .catch(error => res.status(300).json(error))
        }
        catch (error) {
            res.status(400).json(error)
        }
    }

    async admin (req, res) {
        try {
            let page = req.query.page
            if ( page <=0 || undefined || null) {
                page = 1
            }
            const pageSize = 10
            const skip = (page - 1) * pageSize
            const totalDocs =  await Voucher.countDocuments({})
            const totalPage = Math.round(totalDocs/pageSize)
            await Voucher.find({}).sort({createdAt: -1}).skip(skip).limit(pageSize)
                .then(data => res.status(200).json({
                    totalPage,
                    items: data
                }))
                .catch(error => res.status(300).json(error))
        }
        catch (error) {
            res.status(400).json(`Error in VoucherController: ${error.message}`)
        }
    }

    // [POST] /add
    async add(req, res) {
        
        try {
            await Voucher.create({...req.body})
                .then(data => res.status(201).json(data))
                .catch(error => res.status(300).json(error))
        } 
        catch (error) {
            res.status(400).json(error)
        }
    }

    // [DELETE] /delete/:id
    async delete(req, res) {
        try {
            await Voucher.findOneAndDelete({_id: req.params.id})
                .then(result => res.status(201).json(result))
                .catch(error => res.status(404).json({error: 'Not Found'}))
        }
        catch (error) {
            res.status(400).json({error: `Error in VoucherController: ${error.message}`})
        }
    }

    // [POST] /update
    async update (req, res) {
        try {
            const voucherId = req.params.id
            const updateVoucher = req.body
            await Voucher.findOneAndUpdate({_id: voucherId}, {...updateVoucher})
                .then(result => res.status(201).json(result))
                .catch(error => res.status(404).json({error: 'Not Found'}))
        }
        catch (error) {
            res.status(400).json(error)
        }

    }
}

module.exports = new VoucherController
 