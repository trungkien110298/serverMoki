var User = require('../models/user')
var Product = require('../models/product')
var auth = require('../controllers/authController')
var express = require('express')
var set_comment_product = express.Router();

set_comment_product.post('set_comment_product', auth.isAuthenticated, (req, res) => {
    //input : token, product_id, comment, idx,count
    //output : code msss, data = [{id,name, avatar comment,created}]

    //B1 check product_id
    //đúng  tiếp , sai res.json
    //B2, check idx, count
    //B3, check comment có rỗng ko
    //B4 get User lấy comment_list
    //thêm comment
    //gửi lại data : slice(index,index + count)

    var product_id = req.body.product_id
    var comment = req.body.comment
    var index = req.body.index
    var count = req.body.count

    var myIdQuery = { id: req.body.id }
    var productQuery = { product_id: product_id }
    //Xử lý input lỗi
    if (!product_id || !comment || !index || !count) {
        return res.json({
            code: 1004,
            message: "Parameter is invailid."
        })
    }

    index = Number.parseInt(index);
    count = Number.parseInt(count);

    if (!Number.isInteger(index) || index < 0) {
        var msg = {
            code: 1003,
            message: "Index's parameter is invalid."
        }
        res.send(msg)
        return
    }


    if (!Number.isInteger(count) || count <= 0) {
        var msg = {
            code: 1003,
            message: "Count's parameter is invalid."
        }
        res.send(msg)
        return
    }

    //Kiểm tra product
    Product.findOne(productQuery, (err, product) => {
        if (err) throw err
        if (!product) { // Nếu nhập product_id sai
            return res.json({
                code: 9992,
                message: "Product is not existed."
            })
        }
        var commentList = product.comment_list
        User.findOne(myIdQuery, (err, user) => {
            if (err) throw err
            var unitComment = { // nhập đúng thì add comment và danh sách
                id: user.id,
                name: user.name,
                comment: comment,
                avatar: user.avatar
            }

            //unitComment, đọa comment sẽ chuẩn bj thêm

            commentList.push(unitComment)
            //update vào csdl
            Product.findOneAndUpdate(productQuery, { comment_list: commentList }, (err, result) => {
                if (err) throw err
                // gửi dữ liệu về //output : code msss, data = [{id,name, avatar comment,created}]

                Product.findOne(productQuery, (err, product) => {
                    if (err) throw err
                    var commentList = product.comment_list
                    var data = commentList.slice(index, index + count)
                    return res.json({
                        code: 1000,
                        message: "OK",
                        data: data
                    })
                })

            })
        })

    })
});

module.exports = set_comment_product;