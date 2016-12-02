var express = require('express');
var router = express.Router({mergeParams: true}); //without merge, id will not be passed to this file 
var Landscape = require('../models/landscape');
var Comment = require('../models/comment');
var middleware = require('../middleware');//index.js is a special name, here the statement is equivalent to require('../middleware/index.js')

//Comments routes
//NEW route: add new comment to a landscape
//router.get('/landscapes/:id/comments/new', isLoggedIn, function(req, res){
router.get('/new', middleware.isLoggedIn, function(req, res){
    Landscape.findById(req.params.id, function(err, foundLandscape){
        if(!err) {
            console.log('SUCCESS: find landscape by id for commenting');
            res.render('comments/new',{landscape: foundLandscape});
        } else {
            console.log('FAILED: find landscape by id for commenting');
            console.log(err); 
        }
    });
});

//CREATE route: create comment. The reason that we also need to add isLoggedIn
//here is because that someone could use tools like postman to send a post 
//request to this link without login, and we don't want that happen
//router.post('/landscapes/:id/comments', isLoggedIn, function(req, res){
router.post('/', middleware.isLoggedIn, function(req, res){
    Landscape.findById(req.params.id, function(err, landscape) {
        if(!err) {
            console.log('SUCCESS: retrieve the landscape for adding comment');
            var newComment = {
                text: req.body.comment.text, //because we use comment[text] is the comments/new.ejs, so comment is an object
                author: {
                    id: req.user._id,
                    username: req.user.username
                }
            };
            Comment.create(newComment, function(err, comment){
                if(!err) {
                    console.log('SUCCESS: create new comment to be added to a landscape');
                    landscape.comments.push(comment);
                    landscape.save(function(err){
                        if(!err) {
                            console.log('SUCCESS: add comment to landscape');
                            req.flash('success', 'Successfully added a comment');
                        } else {
                            console.log('FAILED: add comment to landscape');
                        }
                    });
                    res.redirect('/landscapes/'+req.params.id);
                } else {
                    console.log('FAILED: create new comment to be added to a landscape');
                    console.log(err); 
                }
            });    
        } else {
            console.log('FAILED: retrieve the landscape for adding comment');
            console.log(err);
        }
    }); 
});

//Edit route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(!err) {
            console.log('SUCCESS: retrieve comment for editing');
            res.render('comments/edit', 
                {
                    comment: foundComment,
                    landscape_id: req.params.id
                }
            );
        } else {
            console.log('FAILED: retrieve comment for editing');
            console.log(err); 
            res.redirect('back');
        } 
    });
});

//Update route
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(!err) {
            console.log('SUCCESS: update comment');
            res.redirect('/landscapes/'+req.params.id);
        } else {
            console.log('FAILED: update comment');
            res.redirect('back');
        }
    });
});

//Destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(!err) {
            console.log('SUCCESS: delete comment');
            res.redirect('/landscapes/' + req.params.id);
        } else {
            console.log('SUCCESS: delete comment');
            console.log(err);
            res.redirect('back');
        }
    });    
});

module.exports = router;