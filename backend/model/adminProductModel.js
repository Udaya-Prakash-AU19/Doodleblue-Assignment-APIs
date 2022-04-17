const mongoose = require('mongoose')
const productSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please enter the name of the product"]
    },
    price: {
        type: Number,
        require: [true, "Please enter the price of the product"]
    },
    description: {
        type: String,
        require: [true, "Please enter the description of the product"]
    },
    quantity: {
        type: Number,
        require: [true, "Please enter the quantity of the product"]
    },
    inStock: {
        type: Boolean,
        default: false
    }

}, { timestamps: true } )

const Products = mongoose.model('Products', productSchema)

module.exports = Products