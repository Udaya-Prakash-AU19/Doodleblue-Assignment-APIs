const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const { protect } = require('../middlewares/authMidware')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/getMe', protect, userController.getMe)

module.exports = router