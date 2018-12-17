var express = require('express');
var auth = require('../controllers/authController_')
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
                if (req.id){
                    res.json({
                        code: 1000, message: 'OK',
                        data: [{
                            id: user.id,
                            email: user.email,
                            username: user.username,
                            phonenumber: user.phonenumber,
                            url: user.url,
                            created: user.created,
                            status: user.status,
                            avatar: user.avatar,
                            cover_image: user.cover_image,
                            cover_image_web: user.cover_image_web,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            address: user.address,
                            city: user.city,
                            rate_lv1: 1,
                            rate_lv2: 1,
                            rate_lv3: 0,
                            online: 1,
                        }]
                    })
                } else
                {
                    res.json({
                        code: 1000, message: 'OK',
                        data: [{
                            id: user.id,
                            username: user.username,
                            url: user.url,
                            created: user.created,
                            status: user.status,
                            avatar: user.avatar,
                            cover_image: user.cover_image,
                            cover_image_web: user.cover_image_web,
                            rate_lv1: 1,
                            rate_lv2: 1,
                            rate_lv3: 0,
                            online: 1,
                        }]
                    })
                }
                
            }
        });

    }
);

module.exports = get_user_info;