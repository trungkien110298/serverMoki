var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CampaignSchema = new Schema({
    campaign_id : String,
    campaign_name : String,
    campaign_detail: String,
    banner : String,
    banner_size : [Number,Number],
    campaign_date : {
        type : Date,
        default : Date.now()
    }
})

module.exports = mongoose.model('Campaign', CampaignSchema)