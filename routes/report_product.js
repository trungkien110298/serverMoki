var express = require('express');
var User = require('../models/user')
var Product = require('../models/product')

var report_product = express.Router();

report_product.post('/report_product', (req, res) => {
    //input token, product_id, subject, details

    var myIdQuery = { id: req.user.id }
    var productQuery = { product_id: req.body.product_id }
    var subject = req.body.subject
    var details = req.body.details
    if (!req.body.product_id)
        return res.status(200).json({
            code: 1002,
            message: "Parameter is not enough (product_id)."
        })
    if (!subject)
        return res.status(200).json({
            code: 1002,
            message: "Parameter is not enough (subject)."
        })
    if (!details)
        return res.status(200).json({
            code: 1002,
            message: "Parameter is not enough (details)."
        })
    //B1 check product_id
    //B2 thêm vào list report
    Product.findOne(productQuery, (err, product) => {
        if (err) return res.status(402).json({
            code: 0000,
            message: "Syntax error"
        })
        //THEM
        if (!product)
            return res.json({
                code: 9992,
                message: "Product is not existed."
            })
        //THEM 8/12
        var data = {
            product_id: product.product_id,
            name: product.product_name,
            image: product.image,
            subject: subject,
            details: details
        }
        User.findOne(myIdQuery, (err, user) => {
            var listReport = user.list_report;
            listReport.push(data);
            User.findOneAndUpdate(myIdQuery, { list_report: listReport }, (err, result) => {
                if (err) throw err
                return res.json({
                    code: 1000,
                    message: "OK",
                    data: listReport
                })
            })
        })
    })
});

module.exports = report_product;