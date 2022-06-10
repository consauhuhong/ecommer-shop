const Products = require('../models/productModel')
const APIfeature = require('../lib/feature')

// class APIfeatures {
//     constructor(query, queryString) {
//         this.query = query;
//         this.queryString = queryString;
//     }
//     searching() {
//         const search = this.queryString.search
//         console.log("serach", search);
//         if (search) {
//             console.log("serach2", search);
//             this.query = this.query.find({
//                 $text: { $search: search }
//             })
//         } else {
//             this.query = this.query.find()
//         }
//         return this;
//     }
//     filtering() {
//         const queryObj = { ...this.queryString } //queryString = req.query

//         const excludedFields = ['page', 'sort', 'limit']
//         excludedFields.forEach(el => delete (queryObj[el]))

//         let queryStr = JSON.stringify(queryObj)
//         queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

//         this.query.find(JSON.parse(queryStr))

//         return this;
//     }

//     sorting() {
//         if (this.queryString.sort) {
//             const sortBy = this.queryString.sort.split(',').join(' ')
//             this.query = this.query.sort(sortBy)
//         } else {
//             this.query = this.query.sort('-createdAt')
//         }

//         return this;
//     }

//     paginating() {
//         const page = this.queryString.page * 1 || 1
//         const limit = this.queryString.limit * 1 || 8
//         const skip = (page - 1) * limit;
//         this.query = this.query.skip(skip).limit(limit)
//         return this;
//     }

// }

const productCtrl = {
    getProducts: async (req, res) => {
        try {
            const features = new APIfeature(Products.find(), req.query)
                .searching()
                .paginating()
                .sorting()
                .filtering()


            const products = await features.query

            res.json({
                status: 'success',
                result: products.length,
                products: products
            })

            // res.json(products)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createProduct: async (req, res) => {
        try {
            const { product_id, title, price, description, content, images, category } = req.body
            if (!images) return res.status(400).json({ msg: "No imaage upload" })

            const product = await Products.findOne({ product_id })
            if (product) return res.status(400).json({ msg: "This product already exits." })

            const newProduct = new Products({
                product_id, title: title.toLowerCase(), price, description, content, images, category
            })
            await newProduct.save()
            res.json(newProduct)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteProduct: async (req, res) => {
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({ msg: "Detele a product" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { title, price, description, content, images, category } = req.body
            if (!images) return res.status(400).json({ msg: "No imaage upload" })

            await Products.findOneAndUpdate({ _id: req.params.id }, {
                title: title.toLowerCase(), price, description, content, images, category,
            })

            res.json({ msg: "Update a product" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = productCtrl