const {io} = require('../../server')
const express = require("express");
const {v4: uuidv4} = require("uuid");
// services
const {activeLobbies} = require('./game.service')
const {readHtmlFile} = require('../../utils/html_inserter')
const {getLobbyId} = require("../lobby_api/lobbyApi.service");
const {
    handlePosMsg,
    handlePelletMsg,
    handleJoinMsg,
    handleDisconnect,
    handlePacmanDead,
    handlePowerUp
} = require('./game.websocket')

const router = express.Router();

router.get('/play', async (req, res, _) => {
    console.log('Received join lobby request')
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
            return
        }
        const lobbyUUId = tmp['lobby_id']

        const result = activeLobbies[lobbyUUId].join(playerTmpUUid, req.authDetails.username)
        // if failed to join lobby because its full or something
        if (!result) {
            res.status(400).send('Lobby is full try another lobby or you are already joined')
            return
        }

        // insert lobbyid and playerid in html
        const html = await insertIdInHTML(
            './public/game/game.html',
            lobbyUUId,
            playerTmpUUid
        )

        if (html === null) {
            res.status(500).send('Internal server error')
        }

        res.set('Content-Type', 'text/html');
        res.send(html);
    } catch (e) {
        console.log(e)
        res.status(500).send('Something went wrong, contact web admins')
    }
})


io.on('connection', (socket) => {
    socket.on('join', async (msg) => {
        try {
            return await handleJoinMsg(msg, socket)
        } catch (e) {
            console.log(e)
        }
    })

    // handle player pos events
    socket.on('pos', (msg) => {
        try {
            return handlePosMsg(msg, socket)
        } catch (e) {
            console.log(e)
        }
    })

    // handle player eating pellets events
    socket.on('pellet', (msg) => {
        try {
            return handlePelletMsg(msg, socket)
        } catch (e) {
            console.log(e)
        }
    });

    socket.on('pacded', (msg) => {
        try {
            return handlePacmanDead(msg, socket)
        } catch (e) {
            console.log(e)
        }
    });

    socket.on('power', (msg) => {
        try {
            return handlePowerUp(msg, socket)
        } catch (e) {
            console.log(e)
        }
    });

    // handle disconnect
    socket.on('disconnect', (reason) => {
        try {
            return handleDisconnect(reason, socket)
        } catch (e) {
            console.log(e)
        }
    });
})

/**
 *
 * @param {string} filePath
 * @param {string} lobbyId
 * @param {string} playerTmpId
 * @return {Promise<Buffer> | null}
 */
async function insertIdInHTML(filePath, lobbyId, playerTmpId) {
    let file
    try {
        file = await readHtmlFile(filePath)
    } catch (e) {
        console.log(`Failed to load in html file as ${filePath}`)
        console.log(e)
        return null
    }
    file = file.replace('{{lobby}}', lobbyId);
    file = file.replace('{{user}}', playerTmpId);
    return Buffer.from(file, 'utf-8')
}

module.exports = router