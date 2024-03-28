class Player {
    /**
     *
     * @param {string|null} commandType
     * @param {string} playerId
     * @param {string} user
     * @param {string} spriteType
     * @param {string} x
     * @param {string} y
     * @param {string} spriteAnim
     */
    constructor(commandType, playerId, user, spriteType, x, y, spriteAnim) {
        this.playerid = playerId;
        this.user = user;
        this.spriteType = spriteType;
        this.x = x;
        this.y = y;
        this.spriteAnim = spriteAnim
    }
}

module.exports = Player