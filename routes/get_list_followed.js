var express = require('express');
var auth = require('../controllers/authController')
var User = require('../models/user')

var get_list_followed = express.Router();

get_list_followed.post('get_list_followed', auth.isAuthenticated, (req, res) => {
    //INPUT token, user_id,index, count
    //OUTPUT code, message, data (những người theo dõi user_id)  
    //                          {id, name,avatar, followed (1,0), 1 là token theo dõi, 0 là ngược lại}


    var userIdQuery = { id: req.body.user_id }
    var myIdQuery = { id: req.body.id }
    var userId = req.body.user_id
    var index = req.body.index
    var count = req.body.count

    if (!userId || !index || !count)
        return res.json({
            code: 1002,
            message: "Parameters is not enough."
        })

    //check index, count

    var check = require('../controllers/checkNumber')

    if (!check(index))
        return res.json({
            code: 1004,
            message: "Parameter's value is invaild. (index)"
        })

    if (!check(count))
        return res.json({
            code: 1004,
            message: "Parameter's value is invailid. (count)"
        })

    count = Number.parseInt(count)
    index = Number.parseInt(index)
    var listFollowing
    var listFollowed = []

    //Lấy ra followed của user
    User.findOne(userIdQuery, (err, user) => {
        if (err) {
            return res.json({
                code: 1004,
                message: "Parameter's value is invailid. (user_id)"
            })
        }
        if (!user)
            return res.json({
                code: 9000,
                message: "User is not existed."
            })
        //listFollowed = user.list_followed
        for (var i = 0; i < user.list_followed.length; i++) {
            var data = {
                id: user.list_followed[i].id,
                name: user.list_followed[i].name,
                avatar: user.list_followed[i].avatar
            }
            listFollowed.push(data)
        }

        if (listFollowed[0] == undefined)
            return res.json({
                code: 1000,
                message: "OK",
                note: "Empty followed list.",
                data: []
            })

        User.findOne(myIdQuery, (err, myUser) => {
            if (err) throw err
            listFollowing = myUser.list_following


            //Tạo mảng theo token theo dõi các user_followed hay chưa

            for (var i = 0; i < listFollowed.length; i++) {
                var check = 0
                for (var j = 0; j < listFollowing.length; j++) {
                    // console.log(listFollowed[i].id, "???" ,listFollowing[j].id)
                    if (listFollowed[i].id == listFollowing[j].id) {
                        check = 1;
                        break;
                    }
                }
                //Nếu 0 cùng ở token following và user followed
                if (check == 0) {
                    listFollowed[i].followed = 0
                }
                //nếu cùng
                else if (check == 1) {
                    listFollowed[i].followed = 1
                }
            }

            if (index >= listFollowed.length) {
                return res.json({
                    code: 1003,
                    message: "Index value is more than ListBlocks's lenght"
                })
            }

            var unitElse
            var notice
            if (index + count > listFollowed.length) {
                count = listFollowed.length
                unitElse = count - index
                notice = 'From index to the end, list has: ' + unitElse + ' users.'
            }

            var data = listFollowed.slice(index, index + count)

            return res.json({
                code: 1000,
                message: "OK",
                note: notice,
                data: data
            })
        })
    })
});

module.exports = get_list_followed;