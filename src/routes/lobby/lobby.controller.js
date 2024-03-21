const express = require('express');
const path = require("path");
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(path.resolve( 'public/lobby/lobby_page.html'));
});

// Route for CSS.
router.get('/lobby/lobby_style.css', (req, res) => {
    res.sendFile(path.resolve( 'public/lobby/lobby_style.css'));
});

// Route for JS.
router.get('/lobby/lobby_scripts.js', (req, res) => {
    res.sendFile(path.resolve( 'public/lobby/lobby_scripts.js'));
});

module.exports = router;
