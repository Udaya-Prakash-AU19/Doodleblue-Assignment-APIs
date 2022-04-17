const mongoose = require('mongoose')
const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        require: true
    },
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: [true, "Please add the description of the product"]
    },
    quantity: {
        type: Number,
        require: true
    }

}, { timestamps: true } )

const Carts = mongoose.model('carts', cartSchema)

module.exports = Carts