require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRoute = require('./src/routes/authRoute')
const compression = require('compression')
const helmet = require('helmet')

const app = express()
const { BASE_URL, FRONTEND_URL, MONGO_URL, PORT } = process.env

mongoose
    .connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB successfully connected!'))
    .catch((err) => console.error(err))

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

app.use(
    cors({
        origin: [
            BASE_URL,
            FRONTEND_URL,
            'rizqirakun.com',
            '*.rizqirakun.com',
            '*.vercel.app',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
)

app.use(helmet()) // csp (Content Security Policy)

app.use(compression()) // Compress all routes

app.use(cookieParser())

app.use(express.json())

app.use('/', authRoute)

// Export the Express API
module.exports = app
