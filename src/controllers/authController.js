const { validationResult } = require('express-validator')
const User = require('../models/userModel')
const { createSecretToken } = require('../utils/secretToken')
const bcrypt = require('bcryptjs')

const STATUS = {
    FAILED: 'failed',
    ERROR: 'error',
    SUCCESS: 'success',
}

module.exports.Register = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: STATUS.FAILED,
            message: 'User data not valid',
            errors: errors.array(),
        })
    }

    try {
        const { name, email, phone, website, password, tos } = req.body

        if (tos !== true) {
            throw {
                status: 400,
                message:
                    'Please accept Talent Growth Terms of Service before registering account',
            }
        }

        const isUserDuplicate = await User.findOne({ email })
        if (isUserDuplicate) {
            throw {
                status: 403,
                message: `Email ${email} is already used`,
            }
        }

        const user = await User.create({
            name,
            email,
            phone,
            website,
            password,
            tos,
        })

        const token = createSecretToken(user._id)
        res.cookie('token', token, {
            withCredentials: true,
            httpOnly: false,
        })
        res.status(201).json({
            status: STATUS.SUCCESS,
            message: 'User registered successfully',
            data: {
                name: user.name,
                email: user.email,
            },
            authorization: {
                token: token,
            },
        })
        next()
    } catch (err) {
        res.status(err.status)
        res.json({ status: STATUS.FAILED, message: err.message })
    }
}

module.exports.Login = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(403).json({
            status: STATUS.FAILED,
            message: 'Email and password field required',
            errors: errors.array(),
        })
    }

    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ message: 'Incorrect password or email' })
        }
        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            return res.json({ message: 'Incorrect password or email' })
        }
        const token = createSecretToken(user._id)
        res.cookie('token', token, {
            withCredentials: true,
            httpOnly: false,
        })
        res.status(201).json({
            status: STATUS.SUCCESS,
            message: 'User logged in successfully',
        })
        next()
    } catch (err) {
        console.error(err)
        const status = err.status || 400
        res.status(status)
        res.json({ status: STATUS.ERROR, message: err.message })
    }
}
