const Product = require('../Models/Product')

class ProductController {
    // [GET] /?page={}
    async getProduct (req, res) { 
        try {
            let page = req.query.page
            if ( page <=0 || undefined || null) {
                page = 1
            }
            const pageSize = 10
            const skip = (page - 1) * pageSize
            const totalDocs = await Product.countDocuments({})
            const totalPage = Math.round(totalDocs/pageSize)
            await Product.find({}).sort({ createdAt: -1 }).skip(skip).limit(pageSize)
                .then(products => res.status(200).json({
                    title: "Sản Phẩm Mới",
                    totalPage,
                    items: products
                }))
                .catch(error => res.status(400).json(error))
        }
        catch (error) {
            res.status(400).json(error)
        }
    }

    // [GET] /:id
    async getProductId (req, res) {
        try {
            await Product.findOne({_id: req.params.id})
                .then(data => res.status(200).json(data))
                .catch(error => res.status(300).json(error))
        }
        catch (error) {
            res.status(400).json(error)
        }
    }
    // [GET] /shirt 
    async getTShirt (req, res) {
        try {
            let page =req.query.page
            if ( page <= 0 || undefined || null) {
                page = 1
            }
            const pageSize = 10
            const skip = (page - 1) * 10
            await Product.find({"category.slug": 'ao'}).skip(skip).limit(pageSize)
                .then(data => res.status(200).json({
                    title: "Áo Nam",
                    items: data
                }))
        }
        catch (error) {
            res.status(400).json(error)
        }
    }

    // [GET] /trousers
    async getTrousers (req, res) {
        try {
            let page = req.query.page
            if ( page <= 0 || undefined || null) {
                page = 1
            }
            const pageSize = 10
            const skip = (page - 1) * pageSize
            await Product.find({"category.slug": 'quan'}).skip(skip).limit(pageSize)
                .then(data => res.status(200).json({
                    title: "Quần Nam",
                    items: data
                }))
        }
        catch (error) {
            res.status(400).json(error)
        }
    }

    async search(req, res) {
        try {
            let page = req.query.page
        if (page <= 0 || undefined || null) {
            page = 1
        }
        const pageSize = 10
        const skip = (page - 1) * 10
        await Product.find({slug: {$regex: req.query.search}}).skip(skip).limit(pageSize)
            .then(data => res.status(200).json(data))
        }
        catch (error) {
            res.status(400).json(error)
        }
    }

    async category (req, res) {
        try {
            let page = req.query.page
            if (page <=0 || undefined || null) {
                page = 1
            }
            const pageSize = 10
            const skip = (page - 1) * 10
            const totalDocs = await Product.countDocuments({"category.slug" : req.params.slug})
            const totalPage = Math.round(totalDocs/pageSize)
            await Product.find({"category.slug" : req.params.slug}).skip(skip).limit(pageSize)
            .then((data) => {
                
                let title
                data[0].category.map((cat)=>{
                    if (cat.slug == req.params.slug) {
                        title = cat.type
                        res.status(200).json({
                            title,
                            totalPage,
                            items : data
                        })
                    }
                })
                
            })
            .catch(error => res.json(error))
            
        }
        catch (error) {
            res.status(400).json(error)
        }
        
    }

    // [POST] /add-product
    async addProduct (req, res) {
        const product = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            thumbnail: req.body.thumbnail,
            category: req.body.category
        }
        try {
            await Product.create(product)
                .then(data => res.status(201).json(data))
                .catch(error => res.status(400).json(error))
        }   
        catch (error) {
            res.status(400).json(error)
        }      
    }

    // [PATCH] /update
    async updateProduct(req, res) {
        try {
            const { id , name, price, category, sale, description} = req.body
            await Product.findOneAndUpdate({_id: id}, {name, price, category, sale, description})
            await Product.findOne({_id : id})
            .then(data => res.status(200).json(data))
        }
        catch (error) {
            res.status(400).json(error)
        }
    }

    // [DELETE] /soft-delete
    async deleteProduct (req, res) {
        try {
            await Product.deleteOne({_id : req.query.id})
            .then(data => res.status(200).json({status: "ok"}))
            .catch(error => res.status(400).json({error: error.message}))
        }
        catch (error) {
            res.status(400).json(`Error in ProductController: ${error.message}`)
        }
    }

    
}

module.exports = new ProductController