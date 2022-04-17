const User = require("../model/userModel")
const Products = require('../model/adminProductModel')
const asyncHandler = require('express-async-handler')

// Upload / create product by Admin
const createProduct = asyncHandler(async (req, res) => {
    if (!req.body.name || !req.body.price || !req.body.description || !req.body.quantity){
        res.status(400)
        throw new Error ("Enter all the details of the product")
    }

    // Setting the inStock to true based on the quantity
    let stock;
    if (req.body.quantity > 0){
        stock = true
    }

    const userId = req.user.id

    // Checking whether the Admin is logged in
    if (!userId) {
        res.status(401)
        throw new Error ("You are not logged in. Please log in to create Product")
    }

    // Role based authentication using JWT
    const isAdmin = req.user.isAdmin

    // Ensuring only the Admin can create the product
    if (!isAdmin){
        res.status(401)
        throw new Error ("Only an admin can create product")
    }

    // Creating the product
    const product = await Products.create({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        quantity: req.body.quantity,
        inStock: stock
    })

    res.status(200).send(product)

})


// get a list of all the products by Admin
const getProducts = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const isAdmin = req.user.isAdmin

    if (!userId) {
        throw new Error("Your are not logged in. Please log in")   
    }

    if (!isAdmin){
        res.status(401)
        throw new Error ("Only an admin can view the details of all products in the database")
    }

    // Getting list of all the products available, by Admin
    const products = await Products.find()

    res.status(200).send(products)
})


// get selected product using id by Admin
const getProductById = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const isAdmin = req.user.isAdmin

    const user = await User.findById(userId)

    if (!user) {
        res.status(401)
        throw new Error("You are not authorized to perform the action")
    }

    if (!isAdmin) {
        res.status(401)
        throw new Error("Only an admin can view details of any product")
    }

    const productId = req.params.id

    // Getting selective product details by Admin
    const product = await Products.findById(productId) 

    res.status(200).send(product)

})


// update product using id by Admin
const updateProductById = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const isAdmin = req.user.isAdmin

    const user = await User.findById(userId)

    if (!user) {
        res.status(401)
        throw new Error("You are not authorized to perform the action")
    }

    // Only Admin can update any product details
    if (!isAdmin){
        res.status(401)
        throw new Error("Only an admin can update product details")
    }

    const productId = req.params.id

    // Ensuring whether the stock availability is maintained after update
    let stock;
    if (req.body.quantity && req.body.quantity > 0){
        stock = true
        req.body.inStock = stock
    }

    // Updating the product if already present
    // Creates product if the product is not present
    const product = await Products.findByIdAndUpdate(productId, req.body, {upsert: true, new: true})

    if (!product) {
        res.status(501)
        throw new Error("Error in updating product")
    }

    res.status(200).send(product)
})


// delete product using id by Admin
const deleteProductById = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const isAdmin = req.user.isAdmin

    if (!userId){
        res.status(401)
        throw new Error("You are not logged in. Please login first")
    }

    if (!isAdmin){
        res.status(401)
        throw new Error("Only an admin can delete the product")
    }

    const productId = req.params.id

    // Deleting the product by Admin
    const findProduct = await Products.findById(productId)
    
    if (!findProduct){
        res.status(401)
        throw new Error("The product you are trying to delete does not exist")
    }

    const product = await Products.findByIdAndDelete(productId)

    if (!product){
        res.status(501)
        throw new Error("Error in deleting the product")
    }

    res.status(200).send(product)

})



module.exports = { createProduct, getProducts, getProductById, updateProductById, deleteProductById }
