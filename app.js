// Rerquire Node JS module
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config/database');
var MongoClient = require('mongodb').MongoClient;
var multer = require('multer');
var favicon = require('serve-favicon');


// Set up Database
mongoose.connect(config.database, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

// Require Routes
var login = require('./routes/login');
var signup = require('./routes/signup');
var logout = require('./routes/logout');
var creat_code_reset_password = require('./routes/creat_code_reset_password');
var check_code_reset_password = require('./routes/check_code_reset_password');
var sms_verify = require('./routes/sms_verify');
var reset_password = require('./routes/reset_password');
var check_password = require('./routes/check_password');
var change_password = require('./routes/change_password');
var get_user_setting = require('./routes/get_user_setting');
var set_user_setting = require('./routes/set_user_setting');
var get_user_info = require('./routes/get_user_info');
var set_user_info = require('./routes/set_user_info');

var get_list_blocks = require('./routes/get_list_blocks');
var blocks = require('./routes/blocks');
var get_comment_product = require('./routes/get_comment_products');
var get_list_followed = require('./routes/get_list_followed');
var get_list_following = require('./routes/get_list_following');
var get_my_likes = require('./routes/get_my_likes');
var like_product = require('./routes/like_product');
var set_comment_product = require('./routes/set_comment_product');
var set_follow_user = require('./routes/set_follow_user');

// Creat server app
var app = express();

// View engine setup

app.set("view engine", "ejs");
app.set("views", "./views");
app.set("layout", "./views/layouts/layout");
app.use(express.static(path.join(__dirname, 'public')));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(morgan('dev'));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage }).single('uploadfile');
app.use(favicon(__dirname + '/public/image/favicon.ico'));


/// Router API

// Kien's API
app.use('/api', signup);                        // Done!
app.use('/api', login);                         // Done!
app.use('/api', logout);                        // Done!
app.use('/api', creat_code_reset_password);     // Done!
app.use('/api', check_code_reset_password);     // Done!
app.use('/api', sms_verify);                    // Done!
app.use('/api', reset_password);                // Done!
app.use('/api', check_password);                // Done!
app.use('/api', change_password);               // Done!
app.use('/api', get_user_setting);              // Done!
app.use('/api', set_user_setting);              // Done!
app.use('/api', get_user_info);                 // Done!
app.use('/api', set_user_info);

// Vuong's API
app.use('/api', get_list_blocks);
app.use('/api', blocks);
app.use('/api', get_comment_product);
app.use('/api', get_list_followed);
app.use('/api', get_list_following);
app.use('/api', get_my_likes);
app.use('/api', like_product);
app.use('/api', set_comment_product);
app.use('/api', set_follow_user);


// Router Render

app.use('/gioithieu', (req, res) => {
    res.render('gioithieu')
})
app.use('/login', (req, res) => {
    res.render('login');
})

app.get("/", function (req, res) {

    MongoClient.connect(config.database, { useNewUrlParser: true }, function (err, db) {
        var query0 = {};
        var query = { list_attached: "Bé ăn" };
        var query1 = { list_attached: "Bé mặc" };
        var query2 = { list_attached: "Bé ngủ" };
        var query3 = { list_attached: "Bé tắm" };
        var dbo = db.db("webdb");
        dbo.collection("Sanpham").find(query).toArray(function (err, result) {
            dbo.collection("Sanpham").find(query1).toArray(function (err, result1) {
                dbo.collection("Sanpham").find(query2).toArray(function (err, result2) {
                    dbo.collection("Sanpham").find(query3).toArray(function (err, result3) {
                        dbo.collection("Sanpham").find(query0).toArray(function (err, result0) {
                            res.render("trangchu", { list: result0, list_betam: result3, list_bengu: result2, list_bemac: result1, list_bean: result });
                            db.close();
                        });
                    });
                });
            });
        });
    });
});

app.get("/chitietsp/:_id", function (req, res) {
    var title = req.params._id;
    // title = title.split("\n")
    // console.log(title[0])
    var mongoClient = require('mongodb').MongoClient;
    var query = { _id: title };
    var test = { image: title }
    mongoClient.connect(config.database, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("webdb");
        dbo.collection("Sanpham").find(test).toArray(function (err, result) {
            if (err) throw err;
            res.render("chitietsp", { list_Sanpham: result });
            db.close();

        });
    });
});


app.listen(process.env.PORT || 3000, () => console.log('Server da khoi dong'));
module.exports = app;