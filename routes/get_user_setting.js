var express = require('express');
var auth = require('../controllers/authController')
var User = require('../models/user')

var get_user_setting = express.Router();

get_user_setting.post('/get_user_setting', auth.isAuthenticated,
    (req, res) => {
        var phonenumber = req.body.phonenumber;
        User.findOne({ phonenumber: phonenumber }, function(err, user){
            if (!user){
                res.json({
                    code: 1005, message: 'Unknownd error',
                    data: []
                });
            } else {
                res.json({
                    code: 1000, message: 'OK',
                    data: [{
                            auto_with_draw: user.setting.auto_with_draw,
                            vacation_mode: user.setting.vacation_mode
                        }]
                });
            }
        });
       
    }
);

module.exports = get_user_setting;