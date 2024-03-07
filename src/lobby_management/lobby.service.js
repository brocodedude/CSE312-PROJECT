const db = require('../db/database');


function list() {
    // return pg.select('id', 'uid', 'lobby_name').from('lobbies')
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
 *
 */
function _delete() {

}

function update() {
}

module.exports = {
    list,
    insert,
    _delete,
    update
}