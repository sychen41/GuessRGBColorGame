var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
//INDEX(目录) route: show all campgrounds
router.get('/', function(req, res){
    Campground.find({},function(err, campgrounds){
        if(!err) {
            console.log('SUCCESS: retrieve campgrounds from db');
            res.render('campgrounds/index', {
                campgrounds: campgrounds
                //currentUser: req.user no longer needed because we added a middleware to do this
            });
        }
        else {
            console.log('FAILED: retrieve campgrounds from db');
            console.log(err);
        }
    });
});

//NEW route: show form to create new campground
router.get('/new', isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

//SHOW route: shows more info about a specific campground
//note: this route MUST be after the NEW route, otherwise, 
//the 'new' in /XXXX/new will be treated as an id
router.get('/:id', function(req, res) {
    /*
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(!err) {
            console.log('SUCCESS: retrieve the user-chosen campground from db');
            foundCampground.populate('comments').exec(function(err, campground){
                if(!err) {
                    console.log('SUCCESS: populate comments for the campground');
                    res.render('show', {campground: campground});
                } else {
                    console.log('FAILED: comments populated for the campground');
                    console.log(err);
                }
            });
        } else {
            console.log('FAILED: retrieve the user-chosen campground from db');
            console.log(err);
        }
    });
    */
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(!err) {
            console.log('SUCCESS: retrieve the user-chosen campground from db and populate it with comment');
            res.render('campgrounds/show', {campground: foundCampground});
        } else {
            console.log('FAILED: retrieve the user-chosen campground from db');
            console.log(err);
        }
    });
});

//CREATE route: add new campground to db
router.post('/', isLoggedIn, function(req, res) {
    Campground.create({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    }, function(err, campg) {
        if(!err) {
            console.log('SUCCESS: new campground inserted to db');
            console.log(campg);
            res.redirect('/campgrounds');
        } else {
            console.log('FAILED: new campground inserted to db');
            console.log(err);
            //do sth to tell users and have them to post again
        }
    });
});

//middleware to check login status
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;