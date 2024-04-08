const db = require('../../db/database');

function list() {
    return db
        .select('lobbies.id', 'lobbies.lobby_name', 'lobbies.created_at', 'users.username', 'users.profile_image_url').from('lobbies')
        .join('users', 'lobbies.uid', 'users.id');
}

/**
 *
 * @param {string}id
 * @return {Knex.QueryBuilder<TRecord, TResult>}
 */
function getLobbyId(id) {
    return db.select('lobby_id', 'joined_players').where({
        'id': id
    }).from('lobbies')
        .first()
}


/**
 *
 * @param {string} uid
 * @param {string} lobby_name
 * @param {string} lobbyId
 * @return
 */
async function insert(uid, lobby_name, lobbyId) {
    return db('lobbies').insert({'uid': uid, 'lobby_name': lobby_name, 'lobby_id': lobbyId, 'joined_players':{'ids':[]}}).returning('id');
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


/**
 * @param {string} id
 * @param {Object<string, string[]>} ids
 */
function updateIdsList(id, ids) {
    return db
        .where('id', id)
        .update({'joined_players': ids})
        .from('lobbies')
        .returning('id')
}

/**
 * @param {string} lobbyUUID
 * @param {string} playerUUID
 */
async function removeIdFromIdsList(playerUUID, lobbyUUID) {
    let result = await db('lobbies')
        .select('joined_players', 'id')
        .where('lobby_id', lobbyUUID)
        .first()

    if (result === undefined) {
        console.log('undefined result list')
        return
    }

    // remove from the result
    // rebuild the new ids list without the id we want to delete
    result['joined_players']['ids'] = result['joined_players']['ids']
        .filter(value => value !== playerUUID)

    return updateIdsList(result['id'], result['joined_players'])
}

module.exports = {
    list,
    getLobbyId,
    insert,
    _delete,
    update,
    updateIdsList,
    removeIdFromIdsList
}