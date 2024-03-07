/**
 * @param {import('express').Request} req - The Express request object
 * @param {import('express').Response} res - The Express response object
 * @param {import('express').NextFunction} next - The next middleware function
 */
function authMiddleWare(req, res, next) {
    // check auth here
    const authHeader = true
    if (!authHeader) {
        return res.status(403).send('Unauthorized');
    }

    // send to next function if authorized
    next();
}