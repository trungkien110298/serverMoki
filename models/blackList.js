var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlackListSchema = new Schema({
    used_token: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model('BlackList', BlackListSchema);