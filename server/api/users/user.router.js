'use strict';

var router = require('express').Router(),
    _ = require('lodash');

var HttpError = require('../../utils/HttpError');
var User = require('./user.model');

router.param('id', function(req, res, next, id) {
    User.findById(id).exec()
        .then(function(user) {
            if (!user) throw HttpError(404);
            req.requestedUser = user;
            next();
        })
        .then(null, next);
});

router.get('/', function(req, res, next) {
	console.log('REQ.USER: ' + req.user)
    User.find({}).exec()
        .then(function(users) {
            res.json(users);
        })
        .then(null, next);
});

router.post('/login', function(req, res, next) {
    console.log(req.body);
    User.findOne({
            email: req.body.email
        }).exec()
        .then(function(user) {
            if (!user || user.password !== req.body.password) {
                console.log('Authentication failed')
                res.status(401).send();
            } else {
                console.log('User logged in');
                req.session.user = {};
                req.session.user._id = user._id;
                req.session.user.name = user.name;
                req.session.user.isAdmin = user.isAdmin;
                console.log(req.session);
                res.status(200).send(user);
            }
        })
        .then(null, next);
});

router.get('/me', function(req, res, next) {
    if (req.session.user) {
        res.send(req.session.user);
    } 
    else{
    	res.send(null);
    }
})

router.post('/', function(req, res, next) {
    User.create(req.body)
        .then(function(user) {
            res.status(201).json(user);
        })
        .then(null, next);
});

router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.status(201).send();
})

router.get('/:id', function(req, res, next) {
    req.requestedUser.getStories()
        .then(function(stories) {
            var obj = req.requestedUser.toObject();
            obj.stories = stories;
            res.json(obj);
        })
        .then(null, next);
});

router.put('/:id', function(req, res, next) {
    _.extend(req.requestedUser, req.body);
    req.requestedUser.save()
        .then(function(user) {
            res.json(user);
        })
        .then(null, next);
});

router.delete('/:id', function(req, res, next) {
    req.requestedUser.remove()
        .then(function() {
            res.status(204).end();
        })
        .then(null, next);
});

module.exports = router;
