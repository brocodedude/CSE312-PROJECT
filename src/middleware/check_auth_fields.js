const {check} = require('express-validator')

const user = check('username').isString().trim().escape();

const pass = check('password').isString().trim().escape();

const validator = [
    user,
    pass
]

module.exports = validator
