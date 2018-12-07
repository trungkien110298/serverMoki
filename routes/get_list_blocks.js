var express = require('express');
var auth = require('../controllers/authController')
var User = require('../models/user')

var get_list_blocks = express.Router();

get_list_blocks.post('/get_list_blocks', auth.isAuthenticated, (req, res) => {
    //input : token, index, count
    //out : code mess, data : {id, name, avatar}
    var index = req.body.index;
    var count = req.body.count;

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

    var idQuery = { id: req.body.id }

    //Kiểm tra list block
    User.findOne(idQuery, (err, user) => {
        if (err) {
            return res.json({
                code: 1001,
                message: "id's value is invailid. (Only number not include character !@#$%^&><?avc)."
            })
        }
        var listBlocks = user.list_block;
        //Nếu index >= length : báo lỗi
        //Nếu count > length : bằng length
        //index + count > length : count = length
        // if(!listBlocks){
        //     return res.json({
        //         code : 1000,
        //         message : 'OK',
        //         data : []
        //     })
        // }

        if (index >= listBlocks.length) {
            return res.json({
                code: 1003,
                message: "Index value is more than ListBlocks's lenght"
            })
        }
        var notice = ''
        var unitElse
        if (index + count > listBlocks.length) {
            count = listBlocks.length
            unitElse = count - index
            notice = 'From index to the end, list has: ' + unitElse + ' users.'
        }
        var data = listBlocks.slice(index, index + count);
        return res.json({
            code: 1000,
            message: 'OK',
            note: notice,
            data: data
        })


    })
});

module.exports = get_list_blocks;