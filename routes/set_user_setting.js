var express = require('express');
var auth = require('../controllers/authController')
var User = require('../models/user')

var set_user_setting = express.Router();

set_user_setting.post('/set_user_setting', auth.isAuthenticated,
    (req, res) => {
        var phonenumber = req.body.phonenumber;
        User.findOne({ phonenumber: phonenumber }, function(err, user){
            if (!user){
                res.json({
                    code: 1005, message: 'Unknownd error',
                    data: []
                });
            } else {
                user.setting.auto_with_draw = req.body.auto_with_draw;
                user.setting.vacation_mode = req.body.vacation_mode;
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

module.exports = set_user_setting;