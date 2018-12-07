var express = require('express');
var signup = express.Router();


var User = require("../models/user");

signup.post('/signup', function (req, res) {
    if (!req.body.phonenumber || !req.body.password) {
        res.json({ code: 1002, message: 'Parameter is not enought.' });
    } else {
        var newUser = new User({
            phonenumber: req.body.phonenumber,
            password: req.body.password
        });

        User.countDocuments({}, (err, c) => {
            var tempId = "" + c;
            while(tempId.length < 7) {
                tempId = "0" + tempId;
            }
            newUser.id = tempId;
            newUser.save(function (err) {
                if (err) {
                    return res.json({ code: 9996, message: 'User existed.' });
                }
                res.json({ code: 1000, message: 'OK' });
            });
        });
    }
});

module.exports = signup;