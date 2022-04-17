const express = require('express')
const router = express.Router()
const productController = require('../controller/adminProductController')
const { protect } = require('../middlewares/authMidware')


router.post('/create', protect, productController.createProduct)
router.get('/view', protect, productController.getProducts)
router.get('/view/:id', protect, productController.getProductById)
router.put('/update/:id', protect, productController.updateProductById)
router.delete('/delete/:id', protect, productController.deleteProductById)


module.exports = router