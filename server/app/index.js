'use strict'; 

var app = require('express')();
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../api/users/user.model');

app.use(require('./logging.middleware'));

app.use(session({secret: 'huh'}));

app.use(function (req, res, next) {
  if (req.session.user) console.log(req.session.user.name);
  next();
});

passport.use(
	new GoogleStrategy({
		clientID: '266120484855-qj7nc0ffprs19saq1sn7q9irnlnco84t.apps.googleusercontent.com',
		clientSecret: '3bjpe6XzGq3cOWI4arTH-YpF',
		callbackURL: 'http://127.0.0.1:8080/auth/google/callback'
	},
	
	function (token, refreshToken, profile, done) {
		console.log(token);
		var newUser = {
			email: profile.emails[0].value,
			name: profile.displayName,
			google: {
				email: profile.emails[0].value,
				name: profile.displayName,
				id: profile.id,
				token: token
			}
		}

		User.findOne({'google.id': newUser.google.id})
			.then(function (user) {
				if (user) {
					done(null, user);
				} else {
					console.log('creating new user');
					return User.create(newUser);
				}
			})
			.then(function (user) {
				done(null, user);
			});
	})
);

passport.serializeUser(function (user, done) {
	done(null, user._id);
});

passport.deserializeUser(function (id, done) {
	User.findOne({_id: id})
		.then(function (user) {
			done(null, user);
		})
		.then(null, function (err) {
			done(err);
		})
});


app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope : 'email' }));

app.get('/auth/google/callback',
  passport.authenticate('google', {
//    successRedirect : '/',
    failureRedirect : '/'
  }),
		function(req, res, next) {
			req.session.user = {};
			req.session.user.name = req.user.name;
			req.session.user._id = req.user._id;
			req.session.user.isAdmin = req.user.isAdmin;
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