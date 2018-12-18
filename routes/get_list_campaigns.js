var Campaign = require('../models/campaigns')
var express = require('express');


var get_list_campaigns = express.Router();

get_list_campaigns.post('/get_list_campaigns', function (req, res) {
    //no input
    // out put : code, mess, data : {code, mess,data : [id,name,banner,banner_size]}

    Campaign.find({},{_id: 0, campaign_id: 1,campaign_name: 1,banner:1,banner_size:1 },(err,cmps)=>{
        if(err) return res.json({
            code : 9001,
            message : "Syntax error."
        })
        if(!cmps) return res.json({
            code : 9001,
            message : "Database error."
        })
        else{
            return res.json({
                code : 1000,
                message : "OK",
                data : cmps
            });
        }
    })
});

module.exports = get_list_campaigns;