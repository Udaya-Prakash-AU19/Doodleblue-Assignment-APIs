const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 2300
const connectDB = require('../configDB/db')
const userRouter = require('../router/userRouter')
const adminProductRouter = require('../router/adminProductRouter')
const customerProductRouter = require('../router/customerProductRouter')
const { errorHandler } = require('../middlewares/errorMidware')

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/users', userRouter)
app.use('/api/admin/products', adminProductRouter)
app.use('/api/customer/products', customerProductRouter)
app.use(errorHandler)

app.listen(PORT, console.log('Server started at PORT', PORT))
