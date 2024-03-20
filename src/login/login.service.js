const db = require('../db/database');
const bcrypt = require("bcrypt");

async function verifyDetails(username, password) {
    return new Promise(
        (resolve, reject) => {
            const saltRounds = 10
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                try {
                    // get user with this hash
                    const result = await db('users').where('password', hash).returning('username')
                    if (result === []) {
                        reject('User not found')
                    }

                    resolve(result)
                } catch (e) {
                    console.log(e)
                    reject(e)
                }
            })
        }
    )

}

/**
 *
 * @param token
 * @return {string}
 */
function hashToken(token) {
    const hash = crypto.createHash('sha256');
    hash.update(token);
    return hash.digest('hex');
}

function generateAuthToken(length = 128) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return hashToken(randomString);
}

function updateAuthToken(uid, token) {
    return db.where('id', uid).update('auth_token', token).from('users').returning('auth_token')
}

function verifyAuthToken(token) {
    const hashed = hashToken(token)
    return db.where('auth_token', hashed).from('users').returning(['id','username'],)
}

module.exports = {
    generateAuthToken,
    verifyDetails,
    updateAuthToken,
    verifyAuthToken
}