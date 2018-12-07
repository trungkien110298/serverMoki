var User = require('../models/user')
var auth = require('../controllers/authController')
var express = require('express')
var set_follow_user = express.Router();

set_follow_user.post('set_follow_user', auth.isAuthenticated, (req, res) => {
    //Input :token, followed_id
    //output : code,msss, data : {follow : count}
    //Phục vụ get followed và get following, khi follow, thêm followee id vào following list cùa mình, và followed list của user

    var myIdQuery = { id: req.body.id }
    var userIdQuery = { id: req.body.followed_id }
    var userId = req.body.followee_id

    if (!userId) {
        return res.json({
            code: 1002,
            message: 'Parameter is not enough (followed_id).'
        })
    }

    for (var i in userId) {
        if (!Number.isInteger(Number.parseInt(userId[i])))
            return res.json({
                code: 1004,
                message: "Parameter's value is invailid (followed_id)."
            })
    }
    //OK tham số

    //Truy cập vào DB của mình
    User.findOne(myIdQuery, (err, myUser) => {
        if (err) throw err
        // lấy ra list_following
        var listFollowing = myUser.list_following
        //Lấy data của followee user
        var check = 0; //chưa có
        for (var i in listFollowing) {
            if (listFollowing[i].id == userId)
                check = 1; //chuyển đã có ngay
        }
        if (check == 1) //Đã follow
        {
            User.findOne(userIdQuery, (err, user) => {
                if (err) throw err;
                if (!user)
                    return res.json({
                        code: 9000,
                        message: "User is not existed"
                    })

                return res.json({
                    code: 1010,
                    message: "Action has been done previously by this user.",
                    data: {
                        follow: user.followed_count
                    }
                })
            })
        }
        else if (check == 0)//Chưa follow
        {
            User.findOne(userIdQuery, (err, user) => {
                if (err) {
                    return res.json({
                        code: 9000,
                        message: "User is not existed."
                    })
                }
                if (!user)
                    return res.json({
                        code: 9000,
                        message: "User is not existed."
                    })
                //Chèn vào listFollowing của token
                var data = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                }
                listFollowing.push(data)
                //chèn xong vào listFollowing
                //Chèn vào listFollowed của followee
                data = {
                    id: myUser.id,
                    name: myUser.name,
                    avatar: myUser.avatar
                }


                var listFollowed = user.list_followed
                var followedCount = user.followed_count
                listFollowed.push(data)
                followedCount += 1

                // Update count, update list_followed (followee_id)
                //update list_following
                console.log("a")
                User.findOneAndUpdate(myIdQuery, { list_following: listFollowing })
                    .exec()
                    .then(console.log(1))
                    .catch((err) => {
                        res.json({ err: err, line: 102 })
                    })
                console.log("b")
                User.findOneAndUpdate(userIdQuery, { list_followed: listFollowed, followed_count: followedCount })
                    .exec()
                    .then(console.log(2))
                    .catch((err) => {
                        res.json({ err: err, line: 108 })
                    })
                console.log("c")
                console.log(3)
                return res.json({
                    code: 1000,
                    message: "OK",
                    data: {
                        follow: followedCount
                    }
                })
            })
        }
    })
});

module.exports = set_follow_user;