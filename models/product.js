var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProductSchema = new Schema({
    product_id: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    like_count: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: ''
    },
    is_sold: {
        type: Number,
        default: 0
    },
    comment_list: [
        {
            id: String,
            name: String,
            comment: String,
            avatar: String,
            created: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    list_like: [
        {
            product_id: String,
            product_name: String,
            price: String,
            image: String,
            is_sold: Number
        }
    ],
    followed_count: {
        type: Number,
        default: 0
    },

    list_block: [
        {
            id: Number,
            name: String,
            avatar: String
        }
    ],
    list_following: [
        {
            id: Number,
            name: String,
            avatar: String
        }
    ],
    list_followed: [
        {
            id: Number,
            name: String,
            avatar: String
        }
    ],
    list_report: [
        {
            id: Number,
            name: String,
            avatar: String,
            subject: String,
            detail: String
        }
    ]

})

module.exports = mongoose.model('Product', ProductSchema);