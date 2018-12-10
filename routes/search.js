var express = require('express');
var config = require('../config/database');
var MongoClient = require('mongodb').MongoClient;

var  search = express.Router();

function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/ầ|ấ|ậ|ẩ|ẫ/g, "â");
    str = str.replace(/ằ|ắ|ặ|ẳ|ẵ/g, "ă");
    str = str.replace(/à|á|ạ|ả|ã|â|ă/g, "a");
    str = str.replace(/ề|ế|ệ|ể|ễ/g, "ê")
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ờ|ớ|ợ|ở|ỡ/g, "ơ");
    str = str.replace(/ồ|ố|ộ|ổ|ỗ/g, "ô");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ơ/g, "o");
    str = str.replace(/ừ|ứ|ự|ử|ữ/g, "ư");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*||∣|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
}
function search_name(X, Y) {
    var X1 = X.toLowerCase();
    var Y1 = Y.toLowerCase();
    var X2 = change_alias(X1);
    var Y2 = change_alias(Y1);
    var chuoi1 = X2.split(" ");
    var chuoi2 = Y2.split(" ");
    var lenX = chuoi1.length;
    var lenY = chuoi2.length;
 
    var a = new Array(lenX + 1);
    for (var i = 0; i < lenX + 1; i++) {
        a[i] = new Array(lenY + 1)
    }

    for (var i = lenX; i >= 0; i--)
        a[i][lenY] = 0;

    for (var j = lenY; j >= 0; j--) {
        a[lenX][j] = 0;
    }
    for (var i = lenX - 1; i >= 0; i--) {
        for (var j = lenY - 1; j >= 0; j--) {
            if (chuoi1[i] == chuoi2[j]) a[i][j] = a[i + 1][j + 1] + 1;
            else a[i][j] = a[i][j + 1] > a[i + 1][j] ? a[i][j + 1] : a[i + 1][j];
        }
    }
    return a[0][0]
}
search.post("/search", function (req, res) {
    var key = req.body.product_name;
    console.log(key);
    if (!key) key = " ";
    var data = new Array();
    var data_num = new Array();
    MongoClient.connect(config.database, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("webdb");

        dbo.collection("Sanpham").find().toArray(function (err, result) {
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                if (search_name(result[i].name, key) > 0) {
                    data.push(result[i]);
                    data_num.push(search_name(result[i].name, key));
                }
            }
            if (data.length != 0) {
                for (var i = 0; i < data.length - 1; i++) {
                    var k2;
                    var max;
                    for (var j = i + 1; j < data.length; j++)
                        if (data_num[i] < data_num[j]) {
                            var k1;
                            k1 = data_num[i]; data_num[i] = data_num[j]; data_num[j] = k1;
                            max = j;
                            k2 = data[i]; data[i] = data[j]; data[j] = k2;
                        }
                    // k2=data[i];data[i]=data[max];data[max]=k2;
                }
            }
            res.render("searchpage", { list_Sanpham: data })// Đổi thành kiểu JSON
            db.close();
        });
    });
});

module.exports = search;