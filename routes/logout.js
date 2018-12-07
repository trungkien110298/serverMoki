var express = require('express');

var logout = express.Router();

var BlackList = require("../models/blackList");


logout.post('/logout', function (req, res) {
    var token = new BlackList();
    if (req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'JWT') {
        // Add used token to Black List
        token.used_token = req.headers.authorization.split(' ')[1];
        token.save(function (err) {
            if (err) {
                return res.json({ code: 1005, message: 'Unknown error.' });
            }
            res.json({ code: 1000, message: 'OK' });
        });
    }
});

module.exports = logout;