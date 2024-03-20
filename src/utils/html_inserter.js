const {readFile} = require("fs");

/**
 *
 * @param filePath
 * @param lobbyId
 * @param playerTmpId
 * @return {Promise<Buffer>}
 */
async function insertValuesInHTML(filePath, lobbyId, playerTmpId) {
    let file = await readHtmlFile(filePath)
    file = file.replace('{{lobby}}', lobbyId);
    file = file.replace('{{user}}', playerTmpId);
    return Buffer.from(file, 'utf-8')
}

function readHtmlFile(filePath) {
    return new Promise((resolve, reject) => {
        readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = {insertValuesInHTML, readHtmlFile}