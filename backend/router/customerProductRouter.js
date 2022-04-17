const express = require('express')
const router = express.Router()
const customerProductController = require('../controller/customerProductController')
const { protect } = require('../middlewares/authMidware')


router.post('/add', protect, customerProductController.addProductToCart)
router.get('/view', protect, customerProductController.getProducts)
router.get('/view/:id', protect, customerProductController.getProductById)
router.put('/update/:id', protect, customerProductController.updateProductByid)
router.delete('/delete/:id', protect, customerProductController.deleteProductById)

module.exports = router