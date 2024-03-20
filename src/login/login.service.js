const db = require('../db/database');
const bcrypt = require("bcrypt");
const crypto = require('crypto')

async function verifyDetails(username, password) {
    return new Promise(
        async (resolve, reject) => {
            try {
                // get user with this hash
                const result = await db('users').where('username', username).first().returning('*')
                if (result === undefined) {
                    reject('User not found')
                }

                // compare hash
                bcrypt.compare(password, result.password, (err, matched) => {
                    if (err) {
                        reject(err)
                    }

                    if (matched) {
                        resolve(result)
                    } else {
                        reject('Invalid Username/Password')
                    }
                })
            } catch (e) {
                console.log(e)
                reject(e)
            }
        }
    )

}

/**
 *
 * @param token
 * @return {string}
 */
function hashToken(token) {
    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
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
    const hashed = hashToken(token)
    return db('users')
        .where('id', uid)
        .update({'auth_token': hashed})
        .returning('auth_token')
}

function verifyAuthToken(token) {
    const hashed = hashToken(token)
    return db
        .where('auth_token', hashed)
        .from('users')
        .returning(['id', 'username'])
        .first()
}

module.exports = {
    generateAuthToken,
    verifyDetails,
    updateAuthToken,
    verifyAuthToken
}