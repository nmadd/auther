'use strict'; 

var app = require('express')();
var path = require('path');
var session = require('express-session');

app.use(require('./logging.middleware'));

app.use(session({secret: 'huh'}));

app.use(function (req, res, next) {
  if (req.session.user) console.log(req.session.user.name);
  next();
});

app.use(require('./requestState.middleware'));

app.use(require('./statics.middleware'));


app.use('/api', require('../api/api.router'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
	app.get(stateRoute, function (req, res) {
		res.sendFile(indexPath);
	});
});

app.use(require('./error.middleware'));

module.exports = app;