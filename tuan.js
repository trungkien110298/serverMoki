const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');




const app = express();
var server = require("http").Server(app);
// Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("views"));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
// Mongo URI
//*****Upload video
const mongoURI = 'mongodb://localhost:27017/uploadfiles';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
	// Init stream
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection('uploads');
});
// Mongo URI
var test = 0;

// Create storage engine
const storage = new GridFsStorage({
	url: mongoURI,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				const filename = buf.toString('hex') + path.extname(file.originalname);
				test = filename;
				const fileInfo = {
					filename: filename,
					bucketName: 'uploads'
				};
				resolve(fileInfo);
			});
		});
	}
});
const upload = multer({ storage });
var imageFile;
// @route GET /
// @desc Loads form
app.get('/themsanpham', (req, res) => {
	gfs.files.find({ filename: test }).toArray((err, files) => {
		// Check if files
		if (!files || files.length === 0) {
			res.render('themsanpham', { files: false, err: false });
		} else {
			imageFile = files;
			files.map(file => {
				if (
					file.contentType === 'image/jpeg' ||
					file.contentType === 'image/png'
				) {
					file.isImage = true;
				} else {
					file.isImage = false;
				}
			});
			res.render('themsanpham', { files: files, err: false });
		}
	});
});
app.get("/test", function (req, res) {
	res.render("test")

})
app.post("/test", function (req, res) {
	console.log(req.body.a);
	res.render("test")

})
// @route POST /upload
// @desc  Uploads file to DB
app.post('/upload', upload.single('file'), (req, res) => {
	// res.json({ file: req.file });
	res.redirect('/themsanpham');
});

// @route GET /files
// @desc  Display all files in JSON
app.get('/files', (req, res) => {
	gfs.files.find().toArray((err, files) => {
		// Check if files
		if (!files || files.length === 0) {
			return res.status(404).json({
				err: 'No files exist'
			});
		}

		// Files exist
		return res.json(files);
	});
});

// @route GET /files/:filename
// @desc  Display single file object
app.get('/files/:filename', (req, res) => {
	gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
		// Check if file
		if (!file || file.length === 0) {
			return res.status(404).json({
				err: 'No file exists'
			});
		}
		// File exists
		return res.json(file);
	});
});


// @route GET /image/:filename
// @desc Display Image
app.get('/image/:filename', (req, res) => {
	gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
		// Check if file
		if (!file || file.length === 0) {
			return res.status(404).json({
				err: 'No file exists'
			});
		}

		// Check if image
		if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
			// Read output to browser
			const readstream = gfs.createReadStream(file.filename);
			readstream.pipe(res);
		} else {
			res.status(404).json({
				err: 'Not an image'
			});
		}
	});
});

//*** add_products api***
var test = 0;
// Create storage engine
var imageFile;
// @route GET /
// @desc Loads form


// @route POST /upload
// @desc  Uploads file to DB



// @route GET /files/:filename
// @desc  Display single file object



app.get("/sp/sp/:_id", function (req, res) {
	var mongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/mydb";
	var _id = req.params._id;

	// id = new require('mongodb').ObjectId;
	var query = { _id: _id };
	mongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var dbo = db.db("mydb");
		dbo.collection("TempSP").findOne(query, function (err, result) {
			if (err) throw err;
			res.render('template', {
				data: result
			})

		});
	});
});




// @route GET /image/:filename
// @desc Display Image
app.get('/image/:filename', (req, res) => {
	gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
		// Check if file
		if (!file || file.length === 0) {
			return res.status(404).json({
				err: 'No file exists'
			});
		}

		// Check if image
		if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
			// Read output to browser
			const readstream = gfs.createReadStream(file.filename);
			readstream.pipe(res);
		} else {
			res.status(404).json({
				err: 'Not an image'
			});
		}
	});
});

// @route DELETE /files/:id
// @desc  Delete file
app.delete('/files/:id', (req, res) => {
	gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
		if (err) {
			return res.status(404).json({ err: err });
		}
		test = 0;
		res.redirect('/themsanpham');
	});
});






var len = 1;
// ***Thêm sản phẩm
// Thêm sản phẩm
app.post("/themsanpham", function (req, res) {
	if (!test) {
		res.render('themsanpham', { files: imageFile, err: [{ msg: "Bạn chưa tải ảnh" }] });
	} else {
		var name = req.body.nameproduct;
		var describle = req.body.describleproduct;
		var bargain1 = req.body.bargainproduct1;
		var bargain2 = req.body.bargainproduct2;
		var bargain;
		if (bargain1 == 'on')
			bargain = "Miễn phí";
		else
			bargain = "Cho phép mặc cả";
		var attached = req.body.attached;
		var label = req.body.label;
		var weight = req.body.weight;
		var state = req.body.state;
		var price = req.body.price;
		var filename = test;
		var errors = 0;
		if (!name || !price || !describle)
			errors = [{ msg: "Bạn nhập thiếu dữ liệu" }];
		if (errors) {
			res.render('themsanpham', { files: imageFile, err: errors });
		} else {
			var MongoClient = require('mongodb').MongoClient;
			var url = "mongodb://localhost:27017/";

			var query = { _id: filename.toString().substring(0, filename.length - 4), image: filename, name: name, price: price + " VNĐ", shop: "aaa", label: label, weight: weight, state: state, attached: attached, bargain: bargain, describle: describle, comment: "", like: "" };
			MongoClient.connect(url, function (err, db) {
				if (err) throw err;
				var dbo = db.db("mydb");
				dbo.collection(attached).insertOne(query, function (err, res) {
					if (err) throw err;
				});
				dbo.collection("TempSP").insertOne(query, function (err, res) {
					if (err) throw err;
				});
				db.close();
				test = 0;
				imageFile = 0;
				res.render('themsanpham', { files: imageFile, err: [{ msg: "Thêm sản phẩm thành công" }] })
				io.sockets.emit("add-product");
			});
		}
	}
})
//****search
// Hàm tìm kiếm
app.get("/trangchu", function (req, res) {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";

	MongoClient.connect(url, function (err, db) {
		var query = {};
		var dbo = db.db("mydb");
		dbo.collection("Sanpham").find().toArray(function (err, result) {
			res.render("trangchu", { list_Sanpham: result });
			db.close();
		});
	});
});
function change_alias(alias) {
	var str = alias;
	str = str.toLowerCase();
	str = str.replace(/ầ|ấ|ậ|ẩ|ẫ/g, "â");
	str = str.replace(/ằ|ắ|ặ|ẳ|ẵ/g, "ă");
	str = str.replace(/à|á|ạ|ả|ã|â|ă/g, "a");
	str = str.replace(/ề|ế|ệ|ể|ễ/g, "ê")
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê/g, "e");
	str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
	str = str.replace(/ờ|ớ|ợ|ở|ỡ/g, "ơ");
	str = str.replace(/ồ|ố|ộ|ổ|ỗ/g, "ô");
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ơ/g, "o");
	str = str.replace(/ừ|ứ|ự|ử|ữ/g, "ư");
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư/g, "u");
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
	str = str.replace(/đ/g, "d");
	str = str.replace(/!|@|%|\^|\*||∣|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
	str = str.replace(/ + /g, " ");
	str = str.trim();
	return str;
}
function search_name(X, Y) {
	var X1 = X.toLowerCase();
	var Y1 = Y.toLowerCase();
	var X2 = change_alias(X1);
	var Y2 = change_alias(Y1);
	var chuoi1 = X2.split(" ");
	var chuoi2 = Y2.split(" ");
	var lenX = chuoi1.length;
	var lenY = chuoi2.length;
	// for(var i=0;i<lenX ;i++){
	//     change_alias(X1[i]);
	// }
	// for(var i=0;i<lenY ;i++){
	//     change_alias(Y1[i]);
	// }
	var a = new Array(lenX + 1);
	for (var i = 0; i < lenX + 1; i++) {
		a[i] = new Array(lenY + 1)
	}

	for (var i = lenX; i >= 0; i--)
		a[i][lenY] = 0;

	for (var j = lenY; j >= 0; j--) {
		a[lenX][j] = 0;
	}
	for (var i = lenX - 1; i >= 0; i--) {
		for (var j = lenY - 1; j >= 0; j--) {
			if (chuoi1[i] == chuoi2[j]) a[i][j] = a[i + 1][j + 1] + 1;
			else a[i][j] = a[i][j + 1] > a[i + 1][j] ? a[i][j + 1] : a[i + 1][j];
		}
	}
	return a[0][0]
}
app.post("/search", function (req, res) {
	var key = req.body.product_name;
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	var data = new Array();
	var data_num = new Array();
	MongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var dbo = db.db("mydb");
		var re = { name: key };
		dbo.collection("Sanpham").find().toArray(function (err, result) {
			if (err) throw err;
			for (var i = 0; i < result.length; i++) {
				if (search_name(result[i].name, key) > 0) {
					data.push(result[i]);
					data_num.push(search_name(result[i].name, key));
				}
			}
			if (data.length != 0) {
				for (var i = 0; i < data.length - 1; i++) {
					var k2;
					var max;
					for (var j = i + 1; j < data.length; j++)
						if (data_num[i] < data_num[j]) {
							var k1;
							k1 = data_num[i]; data_num[i] = data_num[j]; data_num[j] = k1;
							max = j;
							k2 = data[i]; data[i] = data[j]; data[j] = k2;
						}
					// k2=data[i];data[i]=data[max];data[max]=k2;
				}
			}
			res.render("searchpage", { list_Sanpham: data })// Đổi thành kiểu JSON
			db.close();
		});
	});
});

//***api products
app.get("/products", function (req, res) {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	MongoClient.connect(url, function (err, db) {
		var query = {};
		var dbo = db.db("mydb");
		dbo.collection("Sanpham").find().toArray(function (err, result) {
			res.render("products", { list_Sanpham: result });
			db.close();
		});
	});
});

//****Get list_new
app.get("/get_list_news", function (req, res) {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	MongoClient.connect(url, function (err, db) {
		var query = {};
		var dbo = db.db("mydb");
		dbo.collection("news").find().toArray(function (err, result) {
			res.render("get_list_news", { list_news: result });
			db.close();
		});
	});
})

const port = 5000;

server.listen(port, () => console.log(`Server started on port ${port}`));
