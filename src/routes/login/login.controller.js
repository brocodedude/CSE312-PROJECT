// node libs
const express = require('express');
const path = require("path");
const router = express.Router();

// utils
const {generateAuthToken, verifyDetails, updateAuthToken} = require("./login.service");
const validator = require('./login.validator')
const {validationResult} = require("express-validator");

// consts
const loginHtmlPath = './public/auth/login.html'

// get the login page
router.get('/', async function (req, res, _) {
    const fPath = path.resolve(loginHtmlPath)
    res.sendFile(fPath)
})

// handle login form post request
router.post('/', validator, async function (req, res, _) {
    const validation = validationResult(req);

    if (validation.array().length !== 0) {
        let finalMsg = ''
        for (const msg of validation.array()) {
            finalMsg += `Field: ${msg['path']} has error: ${msg['msg']}`
        }
        res.status(400).send(finalMsg);
        return
    }

    const {
        username, password
    } = req.body

    let result
    try {
        result = await verifyDetails(username, password)
    } catch (e) {
        res.status(400)
        res.statusMessage = 'Invalid Username or Password'
        res.send()
        return
    }

    // create hash auth token
    const authToken = generateAuthToken()
    try {
        // insert hashed auth token
        await updateAuthToken(result.id, authToken)
        console.log('Auth token updated')
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
})


module.exports = router