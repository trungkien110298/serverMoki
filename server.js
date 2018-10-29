var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var Passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');
var app = express();


var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config/database');

//Set Database
mongoose.connect(config.database);


// Set views

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "mysecret"}));
app.use(Passport.initialize());
app.use(Passport.session());



app.set('views', './views');
app.set('view engine', 'ejs');


// Route Home .....................................

app.get('/', (req, res) => res.render('home'));

///.............
app.route('/login')
	.get((req, res) => res.render('login'))
	.post(Passport.authenticate('local', {failureRedirect: '/login',
										  successRedirect: '/loginOK'}))
app.get('/loginOK', (req, res) => res.send('Dang nhap thanh cong'))

///

Passport.use(new LocalStrategy(
	(username, password, done) => {
		fs.readFile('./models/user.json', (err, data) => {
			var db = JSON.parse(data);
			var userRecord = db.find(user => user.phone == username)
			if (userRecord && userRecord.pass == password){
				return done(null, userRecord);
			} else {
				return done(null, false);
			}
		})
	}
))



Passport.serializeUser((user, done) => {
	done(null, user.phone);
})

Passport.deserializeUser((name, done) => {
	fs.readFile('./models/user.json', (err, data) =>{
		var db = JSON.parse(data);
		var userRecord = db.find(user => user.phone == name)
		if (userRecord){
			return done(null, userRecord);
		} else {
			return done(null, false);
		}
	})
})

app.listen(3000, () => console.log('Server da khoi dong o cong 3000'));

