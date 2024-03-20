const db = require('../db/database');

function list() {
    return db.select('id', 'uid', 'lobby_name').from('lobbies')
}

/**
 *
 * @param {string}id
 * @return {Knex.QueryBuilder<TRecord, TResult>}
 */
function getLobbyId(id) {
    return db.select('lobby_id').where({
        'id': id
    }).from('lobbies')
}


/**
 *
 * @param {string} uid
 * @param {string} lobby_name
 * @param {string} lobbyId
 * @return
 */
async function insert(uid, lobby_name, lobbyId) {
    return db('lobbies').insert({'uid': uid, 'lobby_name': lobby_name, 'lobby_id': lobbyId}).returning('id');
}

/**
 * @param {string}id
 * @return {Knex.QueryBuilder<TRecord, TResult>}
 */
function _delete(id) {
    return db.delete(['uid', 'id', 'lobby_name']).where({
        'id': id
    }).from('lobbies')
}

/**
 *
 * @param {string} id
 * @param {string} lobbyName
 */
function update(id, lobbyName) {
    return db.where('id', id).update({'lobby_name': lobbyName}).from('lobbies').returning('id')
}

module.exports = {
    list,
    getLobbyId,
    insert,
    _delete,
    update
}