var express = require('express');
var auth = require('../controllers/authController')
var User = require('../models/user')


var get_user_info = express.Router();

get_user_info.post('/get_user_info', auth.isAuthenticated,
    (req, res) => {
        var phonenumber = req.body.phonenumber;
        User.findOne({ phonenumber: phonenumber }, function (err, user) {
            if (!user) {
                res.json({
                    code: 1005, message: 'Unknownd error',
                    data: []
                });
            } else {
                res.json({
                    code: 1000, message: 'OK',
                    data: [{
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        phonenumber: user.phonenumber,
                        url: user.url,
                        

                    }]
                })
            }
        });

    }
);

module.exports = get_user_info;