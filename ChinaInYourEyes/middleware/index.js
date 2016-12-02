var Landscape = require('../models/landscape');
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkLandscapeOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Landscape.findById(req.params.id, function(err, foundLandscape) {
            if(!err) {
                console.log('SUCCESS: retrieve the landscape for ownership checking');
                //req.user._id is a string, foundLandscape.author.id is a mongoose object
                //see the declaration in models/landscape.js, so we can't use ===
                //if(foundLandscape.author.id === req.user._id)
                if(foundLandscape.author.id.equals(req.user._id)) {//this .equals is written by mongoose
                    console.log('User authorization: user owns the landscape');
                    next(); 
                }
                else {
                    req.flash('error', "You don't have permission to do that");
                    console.log('WARNING: user authorization: user DOES NOT own the landscape');
                    res.redirect('back');
                }
            } else {
                console.log('FAILED: retrieve the landscape for ownership checking');
                console.log(err); 
                req.flash('error', 'Landscape not found');
                res.redirect('back');
            }
        });
    } else {
        console.log('WARNING: user did not login, redirecting back...');
        req.flash('error', 'You need to be logged in first');
        res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership =  function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(!err) {
                console.log('SUCCESS: retrieve the comment for ownership checking');
                //req.user._id is a string, foundComment.author.id is a mongoose object
                //see the declaration in models/comment.js, so we can't use ===
                //if(foundComment.author.id === req.user._id)
                if(foundComment.author.id.equals(req.user._id)) {//this .equals is written by mongoose
                    console.log('User authorization: user owns the comment');
                    next(); 
                }
                else {
                    console.log('WARNING: user authorization: user DOES NOT own the comment');
                    res.redirect('back');
                }
            } else {
                console.log('FAILED: retrieve the comment for ownership checking');
                console.log(err); 
                res.redirect('back');
            }
        });
    } else {
        console.log('WARNING: user did not login, redirecting back...');
        res.redirect('back');
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
};

module.exports = middlewareObj;