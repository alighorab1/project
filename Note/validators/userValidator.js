const { body } = require('express-validator');
const User = require('../models/user');

exports.registerValidator = [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email').custom(async email => {
        const user = await User.findOne({ email });
        if (user) {
            throw new Error('Email already in use');
        }
    }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

exports.loginValidator = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').exists().withMessage('Password is required')
];