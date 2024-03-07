const express = require('express');
const router = express.Router();
const {list, insert, getLobbyId, _delete, update} = require('./lobby.service')
const validator = require('../middleware/lobby_fields.middleware')
const {v4: uuidv4} = require('uuid');
const {validationResult} = require("express-validator");

router.get('/', async function (req, res, next) {
    try {
        const result = await list()
        res.status(200).send(JSON.stringify(result))
    } catch (e) {
        console.error(e)
        res.status(400).send('Bad request. Make sure you are sending the correct data with correct values')
    }
});

router.get('/:id', async function (req, res, next) {
    const id = req.params.id;

    if (isNaN(id)) {
        res.status(400).send('Bad Request. Make sure the url is properly formated')
    }

    try {
        const result = await getLobbyId(id)
        res.status(200).send(JSON.stringify(result[0]))
    } catch (e) {
        console.error(e)
        res.status(400).send('Bad request. Make sure you are sending the correct data with correct values')
    }
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


router.patch('/:id', async function (req, res, next) {

    const id = req.params.id;

    if (isNaN(id)) {
        res.status(400).send('Bad Request. Make sure the url is properly formatted')
    }

    const lobbyName = req.body.lobby_name

    if (lobbyName === undefined) {
        res.status(400).send('Bad Request. Incorrect or No data found in body')
    }

    try {
        // encode to escape any characters
        const result = await update(id, lobbyName.encode())
        res.status(200).send(JSON.stringify(result[0]))
    } catch (e) {
        console.error(e)
        res.status(400).send('Bad request. Make sure you are sending the correct data with correct values')
    }
})
router.delete('/:id', async function (req, res, next) {
    const id = req.params.id;

    if (isNaN(id)) {
        res.status(400).send('Bad Request. Make sure the url is properly formatted')
    }

    try {
        const result = await _delete(id)
        res.status(200).send(JSON.stringify(result[0]))
    } catch (e) {
        console.error(e)
        res.status(400).send('Bad request. Make sure you are sending the correct data with correct values')
    }
});


module.exports = router