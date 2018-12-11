var express = require('express');
var User = require('../models/user');
var Product = require('../models/product');

var get_rates = express.Router();

get_rates.post('/get_rates', (req,res)=>{
    //token,
    //index
    //count
    //level
    var user = req.user;
    var index = req.body.index
    var count = req.body.count
    var level = req.body.level
    

    User.findOne({id : user.id}, (err,user)=>{
        if(err) return res.json({
            code : 1009,
            message : "OK"
        })
        if(level == 0)
        {
            return res.json({
                code : 1000,
                message : "OK",
                data : {
                    level1 : user.list_rate.level1,
                    level2 : user.list_rate.level2,
                    level3 : user.list_rate.level3,
                }
            })
        }

        if(level ==1)
        {
            return res.json({
                code : 1000,
                message : "OK",
                data : {
                    level1 : user.list_rate.level1
                }
            })
        }
        if(level ==2)
        {
            return res.json({
                code : 1000,
                message : "OK",
                data : {
                    level2 : user.list_rate.level2
                }
            })
        }
        if(level ==3)
        {
            return res.json({
                code : 1000,
                message : "OK",
                data : {
                    level3 : user.list_rate.level3
                }
            })
        }
    })
});

module.exports = get_rates;