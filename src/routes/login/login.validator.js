const {check} = require('express-validator')

const user = check('username').notEmpty().isString().trim().escape();

const pass = check('password').notEmpty().isString().trim().escape();

const validator = [
    user,
    pass
]

module.exports = validator
