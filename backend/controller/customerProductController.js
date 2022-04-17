const User = require("../model/userModel")
const Products = require("../model/adminProductModel")
const Carts = require('../model/customerProductModel')
const asyncHandler = require('express-async-handler')


// Create order / Add product to cart by Customer
const addProductToCart = asyncHandler(async (req, res) => {
    // Getting userId from token
    const userId = req.user.id

    if (!userId) {
        res.status(400)
        throw new Error ("You are not logged in. Please log in to add Product")
    }

    // Getting inStock and quantity from the req.body
    const { id, inStock, quantity } = req.body

    // If the product viewed is out of Stock
    if (!inStock){
        res.status(400)
        throw new Error("The product is out of Stock")
    }

    const isProduct = await Products.findById(id)

    // The product might be purchased by someone in the meantime the current customer is viewing
    if (!isProduct.inStock){
        res.status(401)
        throw new Error("The product is out of Stock")
    }

    // Checking for the quantity
    if (!quantity){
        res.status(400)
        throw new Error("Enter the quantity of the product")
    }

    // Checking for the right quantity
    if (quantity > isProduct.quantity){
        res.status(401)
        throw new Error("Required quantity must be less than or equal to the quantity available")
    }


    // Creating the product into the database
    const product = await Carts.create({
        userId: req.user.id,
        productId: id,
        name: isProduct.name,
        price: isProduct.price,
        description: isProduct.description,
        quantity: quantity
    })

    res.status(200).send(product)

})


// get a list of all the products in the cart of the Customer
const getProducts = asyncHandler(async (req, res) => {
    const userId = req.user.id

    if (!userId){
        throw new Error("You are not logged in. Please log in to add Product")
    }

    // Getting all the products of the respective customer only
    const products = await Carts.find({userId: userId})

    if (products.length === 0){
        res.status(200).send("No products in Cart")
    }

    res.status(200).send(products)

})


// get a product by id, in the cart of the Customer
const getProductById = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const user = await User.findById(userId)

    if (!user) {
        res.status(401)
        throw new Error("You are not authorized to perform the action")
    }

    const cartId = req.params.id

    // Getting the selected product of the respective customer only
    const product = await Carts.findById(cartId)
    
    // Checking whether the customer is requesting his/her own product
    if (userId !== product.userId.toString()) {
        res.status(401)
        throw new Error("You are not authorised to view other customer's information")
    }
    
    res.status(200).send(product)

})


// update order / the quantity of the product that a customer has in his/her cart
const updateProductByid = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const user = await User.findById(userId)

    if (!user) {
        res.status(401)
        throw new Error("You are not authorized to perform the action")
    }

    const quantity = req.body.quantity
    const productId = req.body.productId
    const cartId = req.params.id

    // Checking if the requested product to update is present
    const product = await Carts.findById(cartId)

    if (!product) {
        res.status(401)
        throw new Error("Product not found")
    }

    // Checking whether the customer is requesting his/her own product
    if (userId !== product.userId.toString()) {
        res.status(401)
        throw new Error("You are not authorised to update other user's information")
    }

    // To check for the right quantity of the products before updating
    const productsAvailable = await Products.findById(productId)

    if (quantity > productsAvailable.quantity){
        res.status(401)
        throw new Error("Required quantity must be less than or equal to the quantity available")
    }

    // Customer can update quantity only
    const updatedProduct = await Carts.findByIdAndUpdate(cartId, {quantity: quantity}, {new: true})

    if (!updatedProduct) {
        res.status(501)
        throw new Error("Error in updating the product. Please try again later")
    }

    res.status(200).send(updatedProduct)
})


// Cancel order / Delete the product by id, in the cart by the Customer
const deleteProductById = asyncHandler(async (req, res) => {
    const userId = req.user.id

    if (!userId){
        throw new Error("You are not logged in. Please log in to add Product")
    }

    const cartId = req.params.id

    // Deleting the product of the customer
    const product = await Carts.findByIdAndDelete(cartId)

    if (!product){
        res.status(400)
        throw new Error("No product matches found to delete")
    }

    res.status(200).send(product)

})


module.exports = { addProductToCart, getProducts, getProductById, updateProductByid, deleteProductById }
