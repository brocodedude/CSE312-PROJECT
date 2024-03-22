const express = require('express');
const path = require("path");
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(path.resolve( 'public/index/index.html'));
});

// Route for CSS.
router.get('/index/index.css', (req, res) => {
    res.sendFile(path.resolve( 'public/index/index.css'));
});

// Route for JS.
router.get('/index/index.js', (req, res) => {
    res.sendFile(path.resolve( 'public/index/index.js'));
});

module.exports = router;
