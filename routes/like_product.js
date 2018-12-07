var express = require('express');
var auth = require('../controllers/authController')
var User = require('../models/user')

var like_product = express.Router();

like_product.post('like_product', auth.isAuthenticated, (req, res) => {

    //input : token, product_id
    //output : data, like hiện tại
    //Kiểm tra có dữ liệu req.user ko, có tức là token đúng, ko tức là token sai

    Product.findOne({ product_id: req.body.product_id }, (err, product) => {
        if (err) {
            return res.json({
                code: 1002,
                code: 1004,
                message: 'Not enough params or wrong params name.'
            })
        }
        if (!product) {
            return res.json({
                code: 9992,
                message: "Product is not existed."
            })
        }
        else {
            //Kiểm tra đã product_id có trong user.list_like chưa
            User.findOne({ id: req.body.id }, (err, user) => {
                if (err) throw err;
                //còn lại chắc chắn có user vì đã check ở middlewares
                var listLike = user.list_like;
                var i;
                var check = 0;
                for (i = 0; i < listLike.length; i++) {
                    if (listLike[i].product_id == product.product_id) {
                        check = 1;
                        break;
                    }
                }
                if (check == 0) {//chưa like
                    //Tăng like, add vào list Like
                    // product_id : String,
                    // product_name : String,
                    // price : String,
                    // image : String,
                    // is_sold : Number 
                    var data = {
                        product_id: product.product_id,
                        product_name: product.product_name,
                        price: product.price,
                        image: product.image,
                        is_sold: product.is_sold
                    }
                    User.findOne({ id: req.user.id }, (err, user) => {
                        var listLike = user.list_like;
                        listLike.push(data);
                        User.findOneAndUpdate({ id: req.user.id }, { list_like: listLike }, (err, result) => {
                            if (err) {
                                return res.json({
                                    code: 1002,
                                    code: 1004,
                                    message: 'Not enough params or wrong params name.'
                                })
                            }
                            else {
                                //Update like_count
                                Product.findOne({ product_id: req.body.product_id }, (err, product) => {
                                    if (err) throw err;
                                    var newLikeCount = product.like_count + 1;
                                    Product.findOneAndUpdate({ product_id: req.body.product_id }, { like_count: newLikeCount }, (err, result) => {
                                        if (err) throw err;
                                        //Gửi dữ liệu về
                                        Product.findOne({ product_id: req.body.product_id }, (err, product) => {
                                            if (err) throw err;
                                            return res.json({
                                                code: 200,
                                                message: 'OK',
                                                data: {
                                                    like: product.like_count
                                                }
                                            })
                                        })

                                    })
                                })
                            }
                        })
                    });

                }
                else {
                    //Đã có trong list_like tại vị trí i
                    listLike.splice(i, 1);
                    //Xóa khỏi list_like
                    User.findOneAndUpdate({ id: req.user.id }, { list_like: listLike }, (err, result) => {
                        if (err) {
                            return res.json({
                                code: 1002,
                                code: 1004,
                                message: 'Not enough params or wrong params name.'
                            })
                        }
                        else {
                            //Update like_count
                            Product.findOne({ product_id: req.body.product_id }, (err, product) => {
                                if (err) throw err;
                                var newLikeCount = product.like_count - 1;
                                Product.findOneAndUpdate({ product_id: req.body.product_id }, { like_count: newLikeCount }, (err, result) => {
                                    if (err) throw err;
                                    //Gửi dữ liệu về
                                    Product.findOne({ product_id: req.body.product_id }, (err, product) => {
                                        if (err) throw err;
                                        return res.json({
                                            code: 200,
                                            message: 'OK',
                                            data: {
                                                like: product.like_count
                                            }
                                        })
                                    })

                                })
                            })
                        }

                    })
                    //Giảm like

                }
            })

            //User.findOneAndUpdate({id : req.user.id}, {})
        }
    })
});

module.exports = like_product;