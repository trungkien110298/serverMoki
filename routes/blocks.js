var express = require('express');
var auth = require('../controllers/authController')
var User = require('../models/user')
var auth = require('../controllers/authController')

var blocks = express.Router();

blocks.post('/blocks', auth.isAuthenticated, (req, res) => {
    //input : token, user_id, type
    //output : code, message, data : {id,name ,avatar}

    //B1 Check user_id xem có tồn tại không
    var userId = req.body.user_id
    var userIdQuery = { id: req.body.user_id }
    var myIdQuery = { id: req.body.id }
    var type = req.body.type

    if (type != 0 && type != 1) {
        console.log(type)
        return res.json({
            code: 1004,
            message: "Type's params's value is invailid."
        })
    }
    if (!userIdQuery) {
        return res.json({
            code: 1003,
            message: "user_id's value is invailid."
        })
    }

    User.findOne(userIdQuery, (err, otherUser) => {
        if (err) {
            return res.json({
                code: 9000,
                message: 'user value is invailid.'
            })
        }
        if (!otherUser) // Nếu user_id không tồn tại
        {
            return res.json({
                code: 9000,
                message: "User is not existed."
            })
        }
        //B2 Kiểm tra xem đã block chưa
        User.findOne(myIdQuery, (err, user) => {
            if (err) throw err;
            
            //console.log(user.list_block);
            var listBlock = user.list_block;
            var check = 0;
            var i;
            for (i = 0; i < listBlock.length; i++) {
                if (listBlock[i].id == userId) {
                    check = 1;
                    break;
                }
            }

            if (check == 0)// chưa block 
            {
                if (type == 0)// báo lỗi về
                {
                    return res.json({
                        code: 1010,
                        message: "Action (unblock) has been done previously by this user."
                    })
                }
                else // blocked 
                {
                    var userData = {
                        id: otherUser.id,
                        username: otherUser.username,
                        avatar: otherUser.avatar
                    }
                    listBlock.push(userData);
                    User.findOneAndUpdate(myIdQuery, { list_block: listBlock }, (err, result) => {
                        if (err) throw err
                        return res.json({
                            code: 1000,
                            message: "OK"
                        })
                    })
                }
            }

            else// block rồi
            {
                if (type == 0)//unlock
                {
                    listBlock.splice(i, 1)
                    User.findOneAndUpdate(myIdQuery, { list_block: listBlock }, (err, result) => {
                        if (err) throw err
                        return res.json({
                            code: 1000,
                            message: "OK"
                        })
                    })
                }
                else // báo lỗi
                {
                    return res.json({
                        code: 1010,
                        message: "Action(block) has been done previously by this user."
                    })
                }

            }
        })
    })



    //Nếu block rồi
    //type = 1
    //Không block được nữa => gửi trả về : 1010 , action has been done previously by this user.
    //type = 0
    //un lock 1000 OK
    //Chưa block
    //type = 1
    //Block luôn, 1000, OK
    //type = 0
    //Chưa unlock : 1010 , action has been done previously by this user.
});

module.exports = blocks;