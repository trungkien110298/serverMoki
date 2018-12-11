var express = require('express');
var config = require('../config/database');
var jwt = require('jsonwebtoken');
var login = express.Router();

var User = require("../models/user");


login.get('/login', function (req, res) {
    res.render('login');
});

login.post('/login', function (req, res) {
    console.log(req.body.phonenumber);
    console.log(req.body.password);
    User.findOne({ phonenumber: req.body.phonenumber }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.status(200).send({ code: 9995, message: 'User is not existed' });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var payload = { phonenumber: user.phonenumber }
                    var token = jwt.sign(payload, config.secret, { expiresIn: '1h' });
                    // return the information including token as JSON
                    res.json({
                        code: 1000, message: 'OK',
                        data: [{ id: user.id, username: user.username, token: 'JWT ' + token, avatar: user.avatar }]
                    });
                } else {
                    res.status(200).send({ code: 1004, message: 'Wrong password' });
                }
            });
        }
    });
});

module.exports = login;