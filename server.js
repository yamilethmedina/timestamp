'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var moment = require('moment');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = 8080;
app.listen(process.env.PORT || port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});


app.get('/', function (req, res) {
	res.send('Timestamp API!')
})

app.get('/:timestamp', function (req, res) {
	// res.json({unix: '', natural: ''})

	var time = moment(req.params.timestamp, 'MMMM DD, YYYY')
	if (!time.isValid()) {
		time = moment.unix(req.params.timestamp)
	}

	if (!time.isValid()) {
		
			res.json({
			"unix": null,
			"natural": null
		})
	}
	else {
		res.json({
			"unix": time.format('X'),
			"natural": time.format('MMMM DD, YYYY')
		})
		}
	})

