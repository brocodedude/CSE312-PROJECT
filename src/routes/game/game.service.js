const express = require('express');
const {getLobbyId} = require('../lobby_api/lobbyApi.service')
const db = require("../../db/database");
const lobbyModel = require('./lobby.model')
const {v4: uuidv4} = require('uuid');
const {io} = require("../../server");

const router = express.Router();

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


/**
 *
 * @param {string} lobby_id - lobby_id
 * @param {string} userId - user id
 * @param {string} playerTmpUUid - tmp user id that is joining
 */
async function joinLobby(lobby_id, playerTmpUUid, userId) {
}


module.exports = {
    activeLobbies,
    initActiveLobbies,
    joinLobby,
    socketIds,
    setSocketId,
    removeSocketId
}