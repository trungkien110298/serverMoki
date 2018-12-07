var express = require('express');
var auth = require('../controllers/authController')
var User = require('../models/user')

var get_my_likes = express.Router();

get_my_likes.post('get_my_likes', auth.isAuthenticated, (req, res) => {
    //nhận được req.user từ middlewares
    //input : token, index, count 
    //output : code, message, data
    var index = req.body.index;
    var count = req.body.count;

    if (!count)
        return res.json({
            code: 1002,
            message: "Parameters is not enough (count)."
        })
    if (!index)
        return res.json({
            code: 1002,
            message: "Parameters is not enough (index)."
        })

    var checkNumber = require('../controllers/checkNumber')
    if (!checkNumber(index)) {
        return res.json({
            code: 1003,
            message: "Index's parameter is invalid."
        })
    }

    if (!checkNumber(count)) {
        return res.json({
            code: 1003,
            message: "Count's parameter is invalid."
        })
    }
    index = Number.parseInt(index);
    count = Number.parseInt(count);

    // if(!Number.isInteger(index) || index < 0){
    //     var msg = {
    //         code : 1003,
    //         message :"Index's parameter is invalid."
    //     }
    //     res.send(msg)
    //     return
    // }


    // if(!Number.isInteger(count) || count <= 0){
    //     var msg = {
    //         code : 1003,
    //         message :"Count's parameter is invalid."
    //     }
    //     res.send(msg)
    //     return
    // }
    var idQuery = { id: req.body.id };
    User.findOne(idQuery, { _id: 0, list_like: 1 }, (err, result) => {
        if (err) throw err;
        var listLike = result.list_like;
        if (index >= listLike.length) {
            return res.json({
                code: 1003,
                message: "Index value is more than List Like's lenght"
            })
        }
        var notice = '';
        if (index + count > listLike.length) {
            count = listLike.length;
            var unitElse = listLike.length - index;
            notice = "From index to the last listLike's index, it has: " + unitElse + " products."

        }
        var data = listLike.slice(index, index + count);
        return res.json({
            code: 200,
            message: "OK",
            note: notice,
            data: data
        })
    })
    //SỬ DỤNG skip và limit
    //Model.find({published: true}, fields, {skip: 10, limit: 10}).sort({'date': -1});
});

module.exports = get_my_likes;