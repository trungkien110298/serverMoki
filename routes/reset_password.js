var express = require('express');
var User = require('../models/user')

var reset_password = express.Router();

reset_password.post('/reset_password', (req, res) => {
    var phonenumber = req.body.phonenumber;
    User.findOne({ phonenumber: phonenumber }, function (err, user) {
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
                user.password = req.body.password;
                user.save();
                var payload = { phonenumber: user.phonenumber }
                var token = jwt.sign(payload, config.secret, { expiresIn: '1h' })
                res.json({
                    code: 1000, message: 'OK',
                    data: [{
                        id: user.id,
                        username: user.username,
                        token: "JWT" + token,
                        avatar: user.avatar
                    }]
                });
            } else {
                res.status(401).send({ code: 1004, message: 'Parameter value is invalid.', data: [] });
            }
        });
    });

});

module.exports = reset_password;



