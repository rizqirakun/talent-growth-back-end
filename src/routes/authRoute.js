const { Register, Login } = require('../controllers/authController')
const { userVerification } = require('../middlewares/authMiddleware')
const router = require('express').Router()
const { body } = require('express-validator')

router.post('/', userVerification)
router.post(
    '/register',
    [
        [
            body('name').notEmpty().trim(),
            body('email').isEmail().trim(),
            body('phone').notEmpty().trim(),
            body('website').notEmpty().isURL().trim(),
            body('password').notEmpty().trim(),
            body('tos').notEmpty().isBoolean(),
        ],
    ],
    Register
)
router.post(
    '/login',
    [[body('email').isEmail().trim(), body('password').notEmpty().trim()]],
    Login
)

module.exports = router
