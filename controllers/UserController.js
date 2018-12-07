var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");
var bcrypt = require('bcrypt');

var url = 'mongodb://localhost/MOKIDB';
/*APIIII*/
var likeProduct = require('./USERAPI/likeproduct');
var signIn = require('./USERAPI/signin');
var signUp =require('./USERAPI/signup');
var getMyLikes = require('./USERAPI/getmylikes');
var setBlocks = require('./USERAPI/setblocks')
var getListBlocks = require('./USERAPI/getlistblocks')
var setCommentProducts = require('./USERAPI/setcommentproducts')
var getCommentProducts = require('./USERAPI/getcommentproducts')
var setUserFollow = require('./USERAPI/setuserfollow')
var getListFollowed = require('./USERAPI/getlistfollowed')
var getListFollowing = require('./USERAPI/getlistfollowing')
/**API
 * 
 */
var User = require('../models/User');
//var Product = require('../models/Product');

exports.sign_up = (req,res)=>{
    signUp(req,res);
}

exports.sign_in = (req,res)=>{
    signIn(req,res);
}

exports.like_product = (req,res)=>{
    likeProduct(req,res);
}

exports.get_my_likes = (req,res)=>{
    getMyLikes(req,res);
}
exports.set_blocks = (req,res)=>{
    setBlocks(req,res);
}
exports.get_list_blocks = (req,res)=>{
    getListBlocks(req,res);
}

exports.set_comment_products = (req,res)=>{
    setCommentProducts(req,res);
}

exports.get_comment_products = (req,res)=>{
    getCommentProducts(req,res)
}

exports.set_user_follow = (req,res)=>{
    setUserFollow(req,res)
}

exports.get_list_followed =(req,res)=>{
    getListFollowed(req,res)
}

exports.get_list_following = (req,res)=>{
    getListFollowing(req,res)
}