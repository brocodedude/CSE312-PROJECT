const express = require('express');
const path = require("path");
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log('Received index req')
    const indexPath = path.join(__dirname, '../../public/index/index.html')
    res.sendFile(indexPath)
});

module.exports = router;
