var express = require('express');
var router = express.Router();
var Landscape = require('../models/landscape');
var Comment = require('../models/comment');
var middleware = require('../middleware');//index.js is a special name, here the statement is equivalent to require('../middleware/index.js')
//INDEX(目录) route: show all landscapes
var landscapesAllIds = [];
var firstTimeLoad = true;
router.get('/', function(req, res){
    Landscape.find({},function(err, landscapes){
        if(!err) {
            if (firstTimeLoad) {
                landscapes.forEach(function (landscape) {
                    landscapesAllIds.push(landscape._id.toString());
                });
                firstTimeLoad = false;
            }
            console.log('SUCCESS: retrieve landscapes from db');
            res.render('landscapes/index', {
                landscapes: landscapes
                //currentUser: req.user //no longer needed because we added a middleware to do this
            });
        }
        else {
            console.log('FAILED: retrieve landscapes from db');
            console.log(err);
        }
    });
});

//NEW route: show form to create new landscape
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('landscapes/new');
});

//SHOW route: shows more info about a specific landscape
//note: this route MUST be after the NEW route, otherwise, 
//the 'new' in /XXXX/new will be treated as an id
router.get('/:id', function(req, res) {
    Landscape.findById(req.params.id).populate('comments').exec(function(err, foundLandscape){
        if(!err) {
            console.log('SUCCESS: retrieve the user-chosen landscape from db and populate it with comment');
            var commentsElapsedDays = [];
            var today = new Date();
            foundLandscape.comments.forEach(function(comment){
                var elapsed = today.getTime() - comment.dateCreated.getTime();
                var elapsedDays = Math.floor(elapsed / (1000*60*60*24));
                if (elapsedDays === 0)
                    commentsElapsedDays.push('today');
                else if (elapsedDays === 1)
                    commentsElapsedDays.push('yesterday');
                else
                    commentsElapsedDays.push(elapsedDays + ' days ago');
            });
            var thisId = foundLandscape._id.toString();
            var indexOfthisId = landscapesAllIds.indexOf(thisId);
            //console.log('length: ' + landscapesAllIds.length);
            //console.log('index: ' + indexOfthisId);
            //if this landscape is the 1st one, set its prev to 'none', otherwise to its previous id
            var prevId = indexOfthisId === 0 ? 'none' : landscapesAllIds[indexOfthisId-1];
            //if this landscape is the last one, set its next to 'none', otherwise to its next id
            var nextId = indexOfthisId === landscapesAllIds.length - 1 ? 'none' : landscapesAllIds[indexOfthisId+1];
            res.render('landscapes/show',
                {
                    landscape: foundLandscape,
                    commentsElapsedDays: commentsElapsedDays,
                    prevId: prevId,
                    nextId: nextId
                });
        } else {
            console.log('FAILED: retrieve the user-chosen landscape from db');
            console.log(err);
        }
    });
});

//CREATE route: add new landscape to db
router.post('/', middleware.isLoggedIn, function(req, res) {
    console.log(JSON.stringify(req.body));
    Landscape.create({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        },
        location: req.body.location,
        lat: req.body.lat,
        lng: req.body.lng
    }, function(err, newlyCreatedlandscape) {
        if(!err) {
            landscapesAllIds.push(newlyCreatedlandscape._id.toString());
            console.log('SUCCESS: new landscape inserted to db');
            res.redirect('/landscapes');
        } else {
            console.log('FAILED: new landscape inserted to db');
            console.log(err);
            //do sth to tell users and have them to post again
        }
    });
});

//Edit route
router.get('/:id/edit', middleware.checkLandscapeOwnership, function(req, res){
    Landscape.findById(req.params.id, function(err, foundLandscape) {
        if(!err) {
            console.log('SUCCESS: retrieve the landscape for editing');
            res.render('landscapes/edit', {landscape: foundLandscape});
        } else {
            console.log('FAILED: retrieve the landscape for editing');
            console.log(err); 
        }
    });
});

//Update route
router.put('/:id', middleware.checkLandscapeOwnership, function(req, res){
    Landscape.findByIdAndUpdate(req.params.id, req.body.landscape, function(err, updatedLandscape){
        if(!err) {
            console.log('SUCCESS: update a landscape');
            res.redirect('/landscapes/'+req.params.id);
        } else {
            console.log('FAILED: update a landscape');
            console.log(err);
            res.redirect('/landscapes');
        }
    });
});

//Destroy route (note: here also delete all detached comments)
router.delete('/:id', middleware.checkLandscapeOwnership, function(req, res){
    Landscape.findByIdAndRemove(req.params.id, function(err, removedLandscape) {
        if(!err) {
            var indexOfRemovedLandscape = landscapesAllIds.indexOf(removedLandscape._id.toString());
            console.log(indexOfRemovedLandscape);
            landscapesAllIds.splice(indexOfRemovedLandscape, 1);
            console.log('SUCCESS: delete a landscape');
            removedLandscape.comments.forEach(function(comment){
                Comment.findByIdAndRemove(comment, function(err, removedComment){
                    if(!err) {
                        console.log('SUCCESS: delete a detached comment');
                        //console.log(removedComment);
                    } else {
                        console.log('FAILED: delete a detached comment');
                        console.log(err);
                    }
                });
            });
            res.redirect('/landscapes');
        } else {
            console.log('FAILED: delete a landscape');
            console.log(err);
            res.redirect('/landscapes');
        }
    });
});

module.exports = router;