const db = require('../db/database');

function list() {
    return db
        .select('lobbies.id', 'lobbies.lobby_name', 'lobbies.created_at', 'users.username').from('lobbies')
        .join('users', 'lobbies.uid', 'users.id');
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
 * @param {string} uid
 * @return {Knex.QueryBuilder<TRecord, TResult>}
 */
function _delete(id, uid) {
    return db.delete(['uid', 'id', 'lobby_name']).where({
        'id': id,
        'uid': uid,
    }).from('lobbies')
}

/**
 *
 * @param {string} uid
 * @param {string} id
 * @param {string} lobbyName
 */
function update(uid, id, lobbyName) {
    return db.where('id', id).where('uid', uid).update({'lobby_name': lobbyName}).from('lobbies').returning('id')
}

module.exports = {
    list,
    getLobbyId,
    insert,
    _delete,
    update
}