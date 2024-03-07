const {check} = require('express-validator')

const uid = check('uid').isString().trim().escape();

const lobby = check('lobby_name').isString().trim().escape();

const validator = [
    uid,
    lobby
]

module.exports = validator
