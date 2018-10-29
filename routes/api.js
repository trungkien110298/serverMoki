var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
var bodyParser = require('body-parser');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var router = express.Router();




var User = require("../models/user");

router.post('/signup', function(req, res) {
    if (!req.body.phonenumber || !req.body.password) {
        res.json({success: false, msg: 'Please pass phonenumber and password.'});
    } else {
        var newUser = new User({
            phonenumber: req.body.phonenumber,
            password: req.body.password
        });
      // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'phonenumber already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
  });

router.post('/signin', function(req, res) {
    User.findOne({ phonenumber: req.body.phonenumber}, function(err, user) {
        if (err) throw err;
  
        if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user.toJSON(), config.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};
module.exports = router;