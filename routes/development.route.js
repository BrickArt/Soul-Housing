var express = require('express');
var router = express.Router();
var fs = require('fs');
var join = require('path').join;

router.get('/log', function (req, res, next) {
    res.sendFile(join(__dirname, '../combined.log'))
    return;
});

router.get('/error', function (req, res, next) {
    res.sendFile(join(__dirname, '../error.log'))
    return;
});

module.exports = router;