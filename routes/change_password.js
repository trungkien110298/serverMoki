var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
var bodyParser = require('body-parser');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var auth = require('../controllers/authController')
var User = require('../models/user')

var change_password = express.Router();

change_password.post('/change_password', auth.isAuthenticated,
    (req, res) => {
        var phonenumber = req.body.phonenumber;
        User.findOne({ phonenumber: phonenumber }, function(err, user){
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    user.password = req.body.new_password;
                    user.save();
                    res.json({
                        code: 1000, message: 'OK',
                        data: [{ is_correct: 1 }]
                    });
                } else {
                    res.status(401).send({ code: 1004, message: 'Parameter value is invalid.', data: [{ is_correct: 0 }] });
                }
            });
        });
       
    }
);

module.exports = change_password;