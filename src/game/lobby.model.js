const Player = require("./player.model");

class LobbyModel {
    // 1 pacman and 3 ghosts
    static maxPlayers = 4

    // todo figure out how to do pellets

    // which player is controlling which character
    charactersList = ['pac', 'gh1', 'gh2', 'gh3']
    /**
     * @type {Object.<string, Player>}
     */
    connectedPlayers = {}
    // stores verified players with their actual id mapped to tmp in game ids
    verifiedPlayers = {}

    /**
     *
     * @param {string} playerTmpId
     * @param {string} userId
     * @return {boolean}
     */
    join(playerTmpId) {
        // check if lobby is full
        if (this.checkIfLobbyIsFull()) {
            console.log('Lobby is full')
            return false
        }

        // randomly assign an available sprite
        const spriteId = this.charactersList[getRandomNumber(0, this.charactersList.length - 1)]

        // add new player to lobby
        this.connectedPlayers[playerTmpId] = new Player('join', playerTmpId, 'Example-user-name', spriteId, "0", "0",)
        return true
    }



    leave(playerTmpId) {
        // get sprite id
        const player = this.connectedPlayers[playerTmpId]
        // return the sprite to available pool
        this.charactersList.push(player.spriteType)
        // remove player
        delete this.connectedPlayers[playerTmpId]
    }

    checkIfLobbyIsFull() {
        return this.charactersList.length === 0;
    }
}

function getRandomNumber(min, max) {
    if (min === max) {
        return min;
    } else {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = LobbyModel