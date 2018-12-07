var express = require('express');
var auth = require('../controllers/authController')
var User = require('../models/user')


var get_list_following = express.Router();

get_list_following.post('get_list_following', auth.isAuthenticated, (req, res) => {
    //input : user_id, index, count
    //check input : user_id only number ; index, count : +integer

    //output : code mess. data : {[id, name,avatar,followed]} :
    //                     mảng following của user_id, followed, nếu token cũng theo dõi


    var userId = req.body.user_id
    var userIdQuery = { id: userId }
    var myIdQuery = { id: req.body.id }
    var index = req.body.index
    var count = req.body.count
    if (!userId || !index || !count) {
        return res.json({
            code: 1003,
            message: "Parameter is not enough."
        })
    }

    /**CHECK INDEX VÀ COUNT Ở ĐÂY */

    var checkNumber = require('../controllers/checkNumber')

    if (!checkNumber(index))
        return res.json({
            code: 1004,
            message: "Parameter is invailid. (index)"
        })

    if (!checkNumber(count))
        return res.json({
            code: 1004,
            message: "Parameter is invailid. (count)"
        })

    count = Number.parseInt(count)
    index = Number.parseInt(index)

    /**ĐẾN ĐÂY THAM SỐ LÀ OKE */

    //Lấy Following list của user

    User.findOne(userIdQuery, (err, user) => {
        if (err)
            return res.json({
                code: 1004,
                message: "Parameter's value is invailid. (user_id)"
            })
        if (!user)
            return res.json({
                code: 9000,
                message: "User is not existed."
            })
        var userListFollowing = []
        var uLFING = user.list_following
        for (var i = 0; i < uLFING.length; i++) {
            var data = {
                id: uLFING[i].id,
                name: uLFING[i].name,
                avatar: uLFING[i].avatar
            }
            userListFollowing.push(data)
        }

        if (userListFollowing[0] == undefined) {
            return res.json({
                code: 1000,
                message: "OK",
                note: "Empty following list.",
                data: []
            })
        }


        //Lấy FollowingList của token

        User.findOne(myIdQuery, (err, myUser) => {
            if (err) throw err

            var myFollowingList = myUser.list_following
            //BẮT ĐẦU CHECK followed của token với user List Following

            for (var i = 0; i < userListFollowing.length; i++) {
                var check = 0
                for (var j = 0; j < myFollowingList.length; j++) {
                    // console.log(userListFollowing[i].id, " ? ", myFollowingList[j].id)
                    if (userListFollowing[i].id == myFollowingList[j].id) {
                        check = 1;
                        break;
                    }
                }
                //console.log(check)
                if (check == 0)
                    userListFollowing[i].followed = check
                else if (check == 1)
                    userListFollowing[i].followed = check
            }




            if (index >= userListFollowing.length)
                return res.json({
                    code: 1003,
                    message: "Index value is more than ListBlocks's lenght"
                })
            var unitElse
            var notice
            var sum = count + index
            console.log(sum, ">", userListFollowing.length)

            if (count + index > userListFollowing.length) {
                count = userListFollowing.length
                unitElse = userListFollowing.length - index
                notice = 'From index to the end, list has: ' + unitElse + ' users.'
            }

            console.log(userListFollowing)
            var data = userListFollowing.slice(index, index + count)
            console.log(data)

            return res.json({
                code: 1000,
                message: "OK",
                note: notice,
                data: data
            })

        })



    })
});

module.exports = get_list_following;