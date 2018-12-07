const express = require('express');
var creat_code_reset_password = express.Router();
var User = require("../models/user");


creat_code_reset_password.post('/create_code_reset_password', (req, res) => {
    User.findOne({ phonenumber: req.body.phonenumber }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.status(401).send({ code: 1004, message: 'Parameter value is invalid.' });
        } else {
            user.reset_password.time = new Date();
            user.reset_password.code = Math.floor(Math.random() * 10000);
    
            while (user.reset_password.code.length < 4) user.reset_password.code = "0" + user.reset_password.code;
            user.save(function (err) {
                if (err) {
                    return res.json({ code: 1005, message: 'Unknown error' });
                }
                res.json({ code: 1000, message: 'OK' });
            });
        }
    });
  
});

module.exports = creat_code_reset_password;