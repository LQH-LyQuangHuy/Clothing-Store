const Banner = require('../Models/Banner')

class BannerController {

    // [GET]/
    async getBanner (req, res) {
        try {
            await Banner.find({}).sort({createdAt: -1}).limit(5)
                .then(data => res.status(200).json(data))
                .catch(error => res.status(300).json(error))
        }
        catch (error) {
            res.status(400).json(error)
        }
    }

    // [POST] /add
    async add(req, res) {
        try {
            await Banner.create({...req.body})
                .then(data => res.status(201).json(data))
                .catch(error => res.status(300).json(error))
        } 
        catch (error) {
            res.status(400).json(error)
        }
    }

    // [POST] /update
    async update (req, res) {
        try {
            await Banner.findOneAndUpdate({name : req.body.name}, {image: req.body.image})
                .then(data => res.status(201).json(data))
                .catch(error => res.json(300).json(error))
        }
        catch (error) {
            res.status(400).json(error)
        }

    }
}

module.exports = new BannerController
 