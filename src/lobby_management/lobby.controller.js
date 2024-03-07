const express = require('express');
const path = require("path");
const router = express.Router();
const idGen = require('../utils/random_num')
const {list, insert, _delete, update} = require('./lobby.service')
const validator = require('../middleware/lobby_fields_middleware')
const {v4: uuidv4} = require('uuid');
const {validationResult} = require("express-validator");

router.get('/', function (req, res, next) {
    res.status(200).send('standby')
});


// create a new lobby
router.post('/', validator, async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // get the fields
    const {
        uid, lobby_name
    } = req.body

    // generate new id
    const lobbyId = uuidv4();

    try {
        const result = await insert(uid, lobby_name, lobbyId)
        res.status(201).send(JSON.stringify(result[0]))
    } catch (e) {
        console.error(e)
        res.status(400).send('Bad request. Make sure you are sending the correct data with correct values')
    }
})

module.exports = router