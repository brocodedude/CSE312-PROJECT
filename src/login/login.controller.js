const express = require('express');
const router = express.Router();
const validator = require('./login.validator')
const {validationResult} = require("express-validator");
const {verifyDetails, generateAuthToken, updateAuthToken} = require("./login.service");
const crypto = require('crypto');

router.post('/login', validator, async function (req, res, next) {
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
        await updateAuthToken(authToken, result[0]['id'])
        res.redirect('/lobby')
    } catch (e) {
        console.log(e)
        res.status(500).send('server error')
    }


    // redirect with auth cookie
})