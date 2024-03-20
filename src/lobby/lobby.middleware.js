const {check} = require('express-validator')

const lobby = check('lobby_name').isString().trim().escape();

const validator = [
    lobby
]

module.exports = validator
