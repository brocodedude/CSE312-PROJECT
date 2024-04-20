const Player = require("./player.model");

class LobbyModel {
    matchStarted = false
    // which player is controlling which character
    charactersList = ['gh1', 'gh2', 'gh3', 'pcm']
    // charactersList = ['gh3', 'pcm']

    /**
     * @type {Object.<string, Player>}
     */
    connectedPlayers = {}

    /**
     * @type {Object.<string, string[]>}
     */
    playerActualIds = {}

    // game state
    /**
     *
     * @type {string[][]}
     */
    pelletsEaten = []
    /**
     *
     * @type {string[][]}
     */
    powerUpsEaten = []
    /**
     *
     * @type {string[]}
     */
    ghostsEaten = []

    // stores verified players with their actual id mapped to tmp in game ids

    /**
     *
     * @param {string} playerTmpId
     * @param {string} username
     * @param {string} playerActualID
     * @param {string} lobbyActualId
     * @return {boolean}
     */
    join(playerTmpId, username, playerActualID, lobbyActualId) {
        // check if lobby is full
        if (this.checkIfLobbyIsFull()) {
            console.log('Lobby is full')
            return false
        }

        // verify user
        for (const player of Object.values(this.playerActualIds)) {
            if (player[0] === playerActualID) {
                console.log('Player already joined lobby')
                return false
            }
        }

        this.playerActualIds[playerTmpId] = [playerActualID, lobbyActualId]

        // remove from available sprite
        const spriteId = this.charactersList.pop()
        if (spriteId === undefined) {
            console.log("no available sprites this should never happen dumbass")
            return false
        }

        // add new player to lobby
        this.connectedPlayers[playerTmpId] = new Player(
            playerTmpId,
            username,
            spriteId,
            "0",
            "0",
            ''
        )
        return true
    }


    leave(playerTmpId) {
        // get sprite id
        const player = this.connectedPlayers[playerTmpId]
        // return the sprite to available pool
        this.charactersList.push(player.spriteType)
        // reset if all players are done playing
        if (this.charactersList.length === 4) {
            this.ghostsEaten = []
            this.pelletsEaten = []
            this.powerUpsEaten = []
        }

        // remove player
        delete this.connectedPlayers[playerTmpId]

        const returnData = this.playerActualIds[playerTmpId]
        delete this.playerActualIds[playerTmpId]
        return returnData
    }

    getGameStateReport() {
        return {
            'ghostsEaten': this.ghostsEaten,
            'pelletsEaten': this.pelletsEaten,
            'powerUpsEaten': this.powerUpsEaten,
        }
    }

    checkIfLobbyIsFull() {
        return this.charactersList.length === 0;
    }

    /**
     *
     * @param {number} duration
     * @param {function(number):void} callBackFunc
     * @param {function():void} endFunc
     */
    startMatchTimer(duration, callBackFunc, endFunc) {
        let timer = duration, minutes, seconds;
        this.matchStarted = true
        let timerInterval = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            callBackFunc(timer)

            if (--timer < 0) {
                endFunc()
                timer = duration;
                clearInterval(timerInterval);
            }
        }, 1000);
    }

    /**
     *
     * @param {number} timer
     */
    sendTimeLeft(timer) {

    }

    matchOver() {
    }

    /**
     *
     * @param {string} x
     * @param {string} y
     */
    pelletEatenAction(x, y) {
        this.pelletsEaten.push([x, y])
    }

    /**
     *
     * @param {string} x
     * @param {string} y
     */
    powerUpEatenAction(x, y) {
        this.powerUpsEaten.push([x, y])
    }

    /**
     *
     * @param {string} ghostID
     */
    ghostEatenAction(ghostID) {
        this.ghostsEaten.push(ghostID)
    }

}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

module.exports = LobbyModel