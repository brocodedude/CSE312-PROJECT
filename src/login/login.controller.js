const express = require('express');
const {app} = require("../server");
const path = require("path");
const validator = require("./login.validator");
const {validationResult} = require("express-validator");
const {generateAuthToken, verifyDetails, updateAuthToken} = require("./login.service");
const router = express.Router();

// get the page
router.get('/', async function (req, res, next) {
    const fPath = path.resolve('./public/auth/login.html')
    res.sendFile(fPath)
})

router.post('/', validator, async function (req, res, next) {
    const errors = validationResult(req);
    // if username or password fields are not passed
    if (!errors.isEmpty()) {
        return res.status(400).json({'Invalid request': errors.array()});
    }

    const {
        username, password
    } = req.body

    let result
    try {
        result = await verifyDetails(username, password)
    } catch (e) {
        res.status(400).send('Invalid credentials')
    }

    // create hash auth token
    const authToken = generateAuthToken()
    try {
        // insert hashed auth token
        await updateAuthToken(result.id, authToken)
        // cookie settings
        const expires = 3 * 3600 * 1000; // 3 hours in milliseconds
        // path '/' makes cookie accessible from all routes
        const cookieOptions = {httpOnly: true, maxAge: expires, path: '/'}
        res.cookie('auth', authToken, cookieOptions)

        res.redirect('/')
    } catch (e) {
        console.log(e)
        res.status(500).send('server error')
    }


    // redirect with auth cookie
})


module.exports = router