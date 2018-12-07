var express = require('express');
var Product = require('../models/product')


var get_comment_product = express.Router();

get_comment_product.post('/get_comment_product', (req,res)=>{
    //input product_id, index, count
    
    var productQuery = {product_id : req.body.product_id}
    var index = req.body.index
    var count = req.body.count
    // Kiểm tra sự rỗng

    if(!(req.body.product_id) || !index || !count)
    {
        return res.json({
            code : 1003,
            message : "Parameter's value is empty."
        })
    }

    var checkNumber = require('../controllers/checkNumber')
    if(!checkNumber(index))
    {
        return res.json({
            code : 1003,
            message :"Index's parameter is invalid."
        })
    }

    if(!checkNumber(count))
    {
        return res.json({
            code : 1003,
            message :"Count's parameter is invalid."
        })
    }

    index = Number.parseInt(index)
    count = Number.parseInt(count)


    
    //Kiểm tra product_id có tồn tại không
    Product.findOne(productQuery, (err,product)=>{
        if(err) throw err
        if(!product)
        return res.json({
            code : 9992,
            message : "Product is not existed."
        })
        //else có product
        var commentList = product.comment_list
        if(index >= commentList.length)
        return res.json({
            code : 1003,
            message : "Index's parameter is invalid."
        })
        //index OK
        var data = commentList.slice(index, index + count)

        return res.json({
            code : 1000,
            message : 'OK',
            data : data
        })
        
    })
    //nếu khong gửi lỗi 9992
    //nếu có lấy data ra
});

module.exports = get_comment_product;