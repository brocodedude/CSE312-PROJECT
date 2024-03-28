const {io} = require('../../server')
const express = require("express");
const {v4: uuidv4} = require("uuid");
const path = require('path')
// services
const {activeLobbies, joinLobby} = require('./game.service')
const {insertValuesInHTML} = require('../../utils/html_inserter')
const {getLobbyId, updateIdsList} = require("../lobby_api/lobbyApi.service");
const {handlePosMsg, handlePelletMsg, handleJoinMsg, handleDisconnect} = require('./game.websocket')

const router = express.Router();

router.get('/play', async (req, res, next) => {
    console.log('Received join lobby_api request')
    // check auth and verify user
    let userId = req.authDetails.id;
    let lobbyId = ''
    try {
        const queryParams = req.url.split('?')[1].split('&')
        lobbyId = queryParams[0].split('=')[1]
    } catch (e) {
        console.log('Failed to read query prams')
        console.log(e)
        res.status(403).send('Make sure the correct parms are passed')
    }
    // generate a tmp user id
    const playerTmpUUid = uuidv4()

    try {
        const tmp = await getLobbyId(lobbyId)
        if (!tmp) {
            console.log('Failed to get lobbyId, Probably incorrect lobbyId')
            res.status(403).send('Invalid request. Lobby is invalid')
        }
        const lobbyUUId = tmp['lobby_id']

        const result = activeLobbies[lobbyUUId].join(playerTmpUUid)

        // if failed to join lobby_api because its full or something
        if (!result) {
            res.status(400).send('Lobby is full try another lobby or you are already joined')
        }

        // add to database
        tmp['joined_players']['ids'].push(playerTmpUUid)
        const g = await updateIdsList(lobbyId, tmp['joined_players'])

        // insert lobbyid and playerid in html
        const html = await insertValuesInHTML(
            './public/game/game.html',
            lobbyUUId,
            playerTmpUUid
        )

        res.set('Content-Type', 'text/html');
        res.send(html);
    } catch (e) {
        console.log(e)
        res.status(403).send('Something went wrong, contact web admins')
    }
})

router.get('/test', async (req, res, next) => {
    try {
        const fPath = path.resolve('./public/game/test.html');
        res.sendFile(fPath);
    } catch (e) {
        console.log(e)
        res.status(403).send('Something went wrong, contact web admins')
    }
})

io.on('connection', (socket) => {
    socket.on('join', (msg) => {
        return handleJoinMsg(msg, socket)
    })

    // handle player pos events
    socket.on('pos', (msg) => {
        return handlePosMsg(msg, socket)
    })

    // handle player eating pellets events
    socket.on('pellet', (msg) => {
        return handlePelletMsg(msg, socket)
    });

    // handle disconnect
    socket.on('disconnect', (reason) => {
        return handleDisconnect(reason, socket)
    });
})

module.exports = router