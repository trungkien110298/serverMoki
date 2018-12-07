var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
var bodyParser = require('body-parser');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var auth = require('../controllers/authController')
var User = require('../models/user')

var set_user_info = express.Router();

set_user_info.post('/set_user_info', auth.isAuthenticated,
    (req, res) => {
        var phonenumber = req.body.phonenumber;
        User.findOne({ phonenumber: phonenumber }, function (err, user) {
            if (!user) {
                res.json({
                    code: 1005, message: 'Unknownd error',
                    data: []
                });
            } else {
                if (req.body.email) user.email = req.body.email;
                if (req.body.username) user.username = req.body.username;
                if (req.body.status) user.status = req.body.status;
                if (req.body.firstname) user.firstname = req.body.firstname;
                if (req.body.lastname) user.lastname = req.body.lastname;
                if (req.body.address) user.address = req.body.address;
                if (req.body.city) user.city = req.body.city;
                if (req.body.password) user.password = req.body.password;
                user.save(function (err) {
                    if (err) {
                        return res.json({ code: 1005, message: 'Unknownd error' });
                    }
                    res.json({ code: 1000, message: 'OK' });
                });
            }
        });

    }
);

module.exports = set_user_info;