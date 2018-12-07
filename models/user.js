var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String
    },
    username: {
        type: String,
        default: "Unknown"
    },
    phonenumber: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    status: {
        type: String
    },
    avatar: {
        type: String
    },
    cover_image: {
        type: String
    },
    cover_image_web: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    active: {
        type: Number,
        default: -1
    },
    setting: {
        auto_with_draw: {
            type: Number,
            default: 0
        },
        vacation_mode: {
            type: Number,
            default: 0
        }

    },
    reset_password: {
        time: String,
        code: String
    },
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
            id: String,
            username: String,
            avatar: String
        }
    ],
    list_following: [
        {
            id: String,
            name: String,
            avatar: String
        }
    ],
    list_followed: [
        {
            id: String,
            name: String,
            avatar: String
        }
    ],
    list_report: [
        {
            id: String,
            name: String,
            avatar: String,
            subject: String,
            detail: String
        }
    ]
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);