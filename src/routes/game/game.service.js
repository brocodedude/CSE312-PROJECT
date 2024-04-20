const express = require('express');
const db = require("../../db/database");
const lobbyModel = require('./lobby.model')
express.Router();
// lobby_api id to LobbyModel
// on new player check id
// if lobby_api exists then do something
// or do something else
/**
 * @type {Object.<string, LobbyModel>} ActiveLobbies
 * Represents a hashmap where keys are lobby_api ids and values are LobbyModels.
 */
let activeLobbies = {}

/**
 * maps sockets to playerUUID and lobbyUUID
 * @type {{}}
 */
let socketIds = {}

// socket management
function setSocketId(userUUId, lobbyUUID, socketId) {
    socketIds[socketId] = [userUUId, lobbyUUID]
}

function removeSocketId(socketId) {
    delete socketIds[socketId]
}

/**
 *
 * @param {Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} socketId
 * @param {string} userTmpId
 * @return {Object | undefined}
 */
function verifySocketId(socketId, userTmpId) {
    if (userTmpId === undefined) {
        console.log('userid is empty')
        return undefined
    }
    return socketIds[socketId][0] === userTmpId;
}

/**
 * Used to load in active lobbies
 * inital activeLobbies will map to null then change as the player joins
 */
async function initActiveLobbies() {
    // fetch all created lobbies with their id
    const uuids = await getAllLobbyIds()

    // insert it into activeLobbies with mapping to null initially
    for (const uuid of uuids) {
        activeLobbies[uuid['lobby_id']] = new lobbyModel()
    }
    console.log('Lobby setup complete')
}


/**
 *
 * @param {string}id
 * @return {Knex.QueryBuilder<TRecord, TResult>}
 */
function getAllLobbyIds() {
    return db.select('lobby_id').from('lobbies')
}


module.exports = {
    activeLobbies,
    socketIds,
    initActiveLobbies,
    setSocketId,
    removeSocketId
}