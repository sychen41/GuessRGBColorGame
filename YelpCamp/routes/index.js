var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get('/', function(req, res){
    res.render('landing');
});

//Auth routes
router.get('/register', function(req, res){
    res.render('register');
});

router.post('/register', function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (!err) {
            console.log("SUCCESS: create a new user and login"); 
            passport.authenticate('local')(req, res, function() {
                req.flash('success', 'Welcome to YelpCamp, ' + user.username);
                res.redirect('/campgrounds');
            });
        } else {
            console.log("FAILED: create a new user and login"); 
            console.log(err);
            req.flash('error', err.message);
            res.redirect('/register');
        }
    });
});

router.get('/login', function(req, res){
    res.render('login');
});

//use middleware to handle login logic 
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req, res){
});

router.get('/logout', function(req, res) {
    req.logout(); //logout() provided by passport
    req.flash('success', 'Logged you out');
    res.redirect('/campgrounds');
});

module.exports = router;