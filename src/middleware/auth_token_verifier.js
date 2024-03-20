const {verifyAuthToken} = require('../login/login.service')

/**
 * checks if a user auth token is authorized
 * @param {import('express').Request} req - The Express request object
 * @param {import('express').Response} res - The Express response object
 * @param {import('express').NextFunction} next - The next middleware function
 */
async function authTokenValidator(req, res, next) {
    // check auth here
    if (!req.cookies.auth) {
        res.status(403).send('Unauthorized');
        return
    }
    const result = await verifyAuthToken(req.cookies.auth)

    if (!result) {
        res.status(403).send('Unauthorized');
        return
    }
    // add details so that next function can access details if needed
    req.authDetails = result
    // send to next function if authorized
    next();
}

module.exports = authTokenValidator