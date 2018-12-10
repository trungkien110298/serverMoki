var express = require('express');
var config = require('../config/database');
var MongoClient = require('mongodb').MongoClient;

var get_request = express.Router();

get_request.get('/', function (req, res) {

    MongoClient.connect(config.database, { useNewUrlParser: true }, function (err, db) {
        var query0 = {};
        var query = { list_attached: "Bé ăn" };
        var query1 = { list_attached: "Bé mặc" };
        var query2 = { list_attached: "Bé ngủ" };
        var query3 = { list_attached: "Bé tắm" };
        var dbo = db.db("webdb");
        dbo.collection("Sanpham").find(query).toArray(function (err, result) {
            dbo.collection("Sanpham").find(query1).toArray(function (err, result1) {
                dbo.collection("Sanpham").find(query2).toArray(function (err, result2) {
                    dbo.collection("Sanpham").find(query3).toArray(function (err, result3) {
                        dbo.collection("Sanpham").find(query0).toArray(function (err, result0) {
                            res.render("trangchu", { list: result0, list_betam: result3, list_bengu: result2, list_bemac: result1, list_bean: result });
                            db.close();
                        });
                    });
                });
            });
        });
    });
});

get_request.get('/gioithieu', (req, res) => {
    res.render('gioithieu')
})
get_request.get('/login', (req, res) => {
    res.render('loginvuongthem');
})

get_request.get("/chitietsp/:_id", function (req, res) {
    var title = req.params._id;
    // title = title.split("\n")
    // console.log(title[0])
    var mongoClient = require('mongodb').MongoClient;
    var query = { _id: title };
    var test = { image: title }
    mongoClient.connect(config.database, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("webdb");
        dbo.collection("Sanpham").find(test).toArray(function (err, result) {
            if (err) throw err;
            res.render("chitietsp", { list_Sanpham: result });
            db.close();

        });
    });
});


get_request.get("/sp/sp/:_id", function (req, res) {
    var mongoClient = require('mongodb').MongoClient;
    var _id = req.params._id;

    // id = new require('mongodb').ObjectId;
    var query = { _id: _id };
    mongoClient.connect(config.database, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("webdb");
        dbo.collection("TempSP").findOne(query, function (err, result) {
            if (err) throw err;
            res.render('products', {
                data: result
            })

        });
    });
});

module.exports = get_request;