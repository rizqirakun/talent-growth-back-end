const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Account name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
    },
    website: {
        type: String,
        required: [true, 'Website link is required'],
    },
    password: {
        type: String,
        required: [true, 'Account password is required'],
    },
    tos: {
        type: Boolean,
        required: [true, 'Terms of service must be checked'],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 12)
})

module.exports = mongoose.model('user', userSchema)
