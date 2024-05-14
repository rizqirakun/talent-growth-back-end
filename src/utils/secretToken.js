require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports.createSecretToken = (id) => {
    const TOKEN = process.env.TOKEN_KEY || ''
    return jwt.sign({ id }, TOKEN, {
        expiresIn: 3 * 24 * 60 * 60,
    })
}
