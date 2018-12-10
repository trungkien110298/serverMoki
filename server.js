var express = require("express");
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://tuan98:tuan98bkhn@ds062339.mlab.com:62339/webdb"
var path = require('path');
app.listen(3000);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var multer = require('multer');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './upload')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})
var upload = multer({ storage: storage }).single('uploadfile');


// cau hinh ejszzyyy
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("views"));
app.use(express.static(path.join(__dirname, 'public')));
//render trang
app.get("/", function (req, res) {

	MongoClient.connect(url, function (err, db) {
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
							res.render("webv2", { list: result0, list_betam: result3, list_bengu: result2, list_bemac: result1, list_bean: result });
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
	//var url = "mongodb://localhost:27017/";
	var query = { _id: title };
	var test = { image: title }
	mongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var dbo = db.db("webdb");
		dbo.collection("Sanpham").find(test).toArray(function (err, result) {
			if (err) throw err;
			res.render("chitietsp", { list_Sanpham: result });
			db.close();

		});
	});
});
app.get("/login", function (req, res) {
	res.render("login");
});
app.get("/gioithieu", function (req, res) {
	res.render("gioithieu");
});
app.get("/bean", function (req, res) {
	MongoClient.connect(url, function (err, db) {
		var query = { list_attached: "Bé ăn" };
		var dbo = db.db("webdb");
		dbo.collection("Sanpham").find(query).toArray(function (err, result) {
			res.render("bean", { list_bean: result });
			db.close();
		});
	});
});