const {io} = require("../../server");
const {activeLobbies, socketIds, removeSocketId, setSocketId} = require('./game.service')


// handle joining
function handleJoinMsg(msg, socket) {
    const {lobbyId, userId} = msg

    // check for lobbyId and playerId
    if (!lobbyId && !userId) {
        console.log('missing data');
        console.log(`${lobbyId} ${userId}`)
        // player will not be known to other clients
        // or the clients will know about the player
        return;
    }

    // TODO check if playerId is valid
    // check lobby_api id
    const lobby = activeLobbies[lobbyId]

    if (lobby === undefined) {
        console.log('Lobby not found')
        // player will not be known to other clients
        // or the clients will know about the player
        return
    }

    const playerData = lobby.connectedPlayers[userId]

    if (playerData === undefined) {
        // player will not be known to other clients
        // or the clients will know about the player
        console.log(`Could not find user in verified list in lobby ${lobbyId}`)
        return;
    }

    console.log(`Valid Player ${userId} connected to ${lobbyId}`);

    // set socket ID for connected client
    setSocketId(userId, lobbyId, socket.id)

    // tell everyone including client that new player joined
    io.emit('set', JSON.stringify(playerData))

    // tell new client current players in lobby_api after client has joined
    for (const player in lobby.connectedPlayers) {
        const currPlayer = lobby.connectedPlayers[player]
        if (currPlayer.playerid !== userId) {
            socket.emit('set', JSON.stringify(currPlayer))
        }
    }
}

function handleDisconnect(disconnectReason, socket) {
    // get player info from socketId about the player leaving
    const data = socketIds[socket.id]

    if (data === undefined){
        console.log('invalid socket')
        // do nothing
        return;
    }

    const userUUID = data[0]
    const lobbyUUID = data[1]

    console.log(`removing user ${userUUID} from lobby ${lobbyUUID}`)
    console.log(disconnectReason)

    // get player from lobby_api
    const lobby = activeLobbies[lobbyUUID]

    if (lobby === undefined) {
        console.log('invalid lobby_api')
        // do nothing
        return
    }

    const player = lobby.connectedPlayers[userUUID]

    if (player === undefined) {
        console.log('invalid player')
        // do nothing
        return
    }

    // remove player from lobby_api
    lobby.leave(userUUID)

    // tell connected clients about user leaving
    io.emit('dis', JSON.stringify(player))
}

function handlePosMsg(msg, socket) {
    // send pos data to everyone but the client
    socket.broadcast.emit('pos', msg)
}

function handlePelletMsg(msg, socket) {
}


module.exports = {
    handleDisconnect,
    handleJoinMsg,
    handlePelletMsg,
    handlePosMsg
}