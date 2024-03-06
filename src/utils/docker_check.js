/**
 * Returns true if running in docker
 * else false if running locally in dev env
 * @returns {boolean}
 */
function isRunningInDocker(){
    const tmp = process.env.dev
    return tmp !== undefined;
}

const isDocker = isRunningInDocker()

module.exports = isDocker