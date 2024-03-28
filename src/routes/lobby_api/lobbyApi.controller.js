const express = require('express');
const router = express.Router();
const {list, insert, getLobbyId, _delete, update} = require('./lobbyApi.service')
const validator = require('./lobbyApi.middleware')
const {v4: uuidv4} = require('uuid');
const {validationResult} = require("express-validator");
const he = require('he');
const {activeLobbies} = require("../game/game.service");
const LobbyModel = require("../game/lobby.model");

router.get('/', async function (req, res, next) {
    try {
        const result = await list()
        res.status(200).send(JSON.stringify(result))
    } catch (e) {
        console.error(e)
        res.status(400).send('Bad request. Make sure you are sending the correct data with correct values')
    }
});

// gets current players joined
router.get('/:id/players', async function (req, res, next) {
    const id = req.params.id;

    if (isNaN(id)) {
        res.status(400).send('Bad Request. Make sure the url is properly formated')
    }
    try {
        // maps max players to connected players
        let data = {4: '0'}
        const result = await getLobbyId(id)
        if (result) {
            const lobby = activeLobbies[result['lobby_id']]
            if (lobby) {
                data['4'] = result['joined_players']['ids'].length
            }
        }
        res.status(200).send(JSON.stringify(data))
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


// create a new lobby_api
router.post('/', validator, async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // get the fields
    const {
        lobby_name
    } = req.body

    // generate new id
    const lobbyId = uuidv4();

    try {
        const result = await insert(req.authDetails.id, lobby_name, lobbyId)
        // add to active lobbies
        activeLobbies[lobbyId] = new LobbyModel()
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
        const result = await update(req.authDetails.id, id, he.encode(lobbyName))
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
        // send the id of the lobby_api to delete and the id of user who requested it
        // this will make sure other users cannot delete other players lobbies
        const result = await _delete(id, req.authDetails.id)
        // remove from active lobbies
        delete activeLobbies[id]
        res.status(200).send(JSON.stringify(result))
    } catch (e) {
        console.error(e)
        res.status(400).send('Bad request. Make sure you are sending the correct data with correct values')
    }
});


module.exports = router