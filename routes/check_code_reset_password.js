const express = require('express');
var check_code_reset_password = express.Router();
var User = require("../models/user");

check_code_reset_password.post('/check_code_reset_password', (req, res) => {
    User.findOne({ phonenumber: req.body.phonenumber }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.status(401).send({ code: 1004, message: 'Parameter value is invalid.' });
        } else {
            var now = new Date();
            var before = new Date(user.reset_password.time);
            var nowTime = now.getTime(); //The number of milliseconds since January 1, 1970
            var beforeTime = before.getTime();
            if ((user.reset_password.code == req.body.code) && (nowTime - beforeTime < 60000))
            {
                res.json({ code: 1000, message: 'OK' });
            } else {
                res.json({ code: 1004, message: 'Parameter value is invalid.' });
            }
        }
    });
});

module.exports = check_code_reset_password;