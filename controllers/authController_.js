var User = require('../models/user');
var config = require('../config/database');
var jwt = require('jsonwebtoken');
var BlackList = require("../models/blackList");


exports.isAuthenticated = function (req, res, next) {
    //console.log(req.headers.authorization);
    if (req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'JWT') {

        var jwtToken = req.headers.authorization.split(' ')[1];

        BlackList.findOne({ used_token: jwtToken }, function (err, used_token) {
            if (used_token) {
                res.status(401).json({ code: 9998, message: 'Token is invalid.' });
            } else {
                jwt.verify(jwtToken, config.secret, { expiresInMinutes: 60 }, function (err, payload) {
                    if (err) {
                        res.status(401).json({ code: 9998, message: 'Token is invalid.' });
                    } else {
                        //console.log('decoder: ' + payload.phonenumber);
                        User.findOne({ phonenumber: payload.phonenumber }, function (err, user) {
                            if (user) {
                                //Authentication success!
                                req.body.id = user.id;
                                req.body.phonenumber = user.phonenumber;
                                next();
                            } else {
                                res.status(401).json({ code: 9998, message: 'Token is invalid.' });
                            }
                        })
                    }
                });
            }
        });

    } else {
        next();
    }
};