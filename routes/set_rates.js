var express = require('express');
var User = require('../models/user');
var Product = require('../models/product');
var set_rates = express.Router();

set_rates.post('/get_rates', (req,res)=>{
    //token
    //product_id
    //rate_level
    //content
    var user = req.user;
    var product_id = req.body.product_id
    var productQuery = {product_id : product_id}
    var level = req.body.rate_level
    var content = req.body.content
    if(!product_id || !level || !content)
    return res.json({
        code : 1003,
        message : "Parameter's value is invailid."
    })
    
    Product.findOne(productQuery,(err,product)=>{
        if(err)
        return res.json({
            code : 1002,
            message : "Parameter's value is wrong."
        })
        if(!product)
        return res.json({
            code : 9992,
            message : "Product is not existed."
        })
        User.findOne({id: req.user.id},(err,user)=>{
            var listRate =  user.list_rate;
            if(level == 1)
            {
                listRate.level1.push({product_id : product_id})
            }
            if(level == 2)
            {
                listRate.level2.push({product_id : product_id})
            }
            if(level == 3)
            {
                listRate.level3.push({product_id : product_id})
            }
            User.findOneAndUpdate({id: req.user.id}, {list_rate: listRate}, (err,result)=>{
                if(err) res.json({
                    code :1003,
                    message: "Parameter's value is invailid"
                })
                return res.json({
                    code : 1000,
                    message : "OK"
                })
            })
        })
    })
    
});
module.exports = set_rates;