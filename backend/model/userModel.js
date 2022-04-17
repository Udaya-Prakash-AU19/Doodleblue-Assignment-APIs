const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Name needs to be entered'],
    },
    email: {
        type: String,
        require: true,
        unique: [true,  'Email needs to be entered']
    },
    password: {
        type: String,
        require: [true, 'Password needs to be entered'],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
})


const User = mongoose.model('User', userSchema)

module.exports = User
