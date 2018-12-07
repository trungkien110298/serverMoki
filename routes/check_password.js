var express = require('express');
var auth = require('../controllers/authController')
var User = require('../models/user')

var check_password = express.Router();

check_password.post('/check_password', auth.isAuthenticated,
    (req, res) => {
        var phonenumber = req.body.phonenumber;
        User.findOne({ phonenumber: phonenumber }, function(err, user){
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
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

module.exports = check_password;