var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
        {
            name: 'c1',
            image: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/280h/HHXM2K6XZN.jpg',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc bibendum nunc vitae sem euismod malesuada. Praesent in neque fringilla, consequat leo quis, tincidunt odio. Maecenas ornare lacus id dui tincidunt tincidunt. Fusce aliquet orci nisi, a sodales sapien placerat eget. Nunc malesuada neque ipsum, vel tempor est sagittis vel. Morbi in dolor a est pharetra sodales quis eget metus. Ut quis rhoncus ante. Etiam viverra tortor sit amet vestibulum tempor. Phasellus eget nunc in enim porta facilisis. Morbi malesuada ipsum quis fringilla tempor. Sed at justo viverra, auctor mi vel, aliquet ex. Fusce eget risus purus. Fusce laoreet malesuada nunc.'
        },
        {
            name: 'c2',
            image: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/280h/5UDAZVSPM6.jpg',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc bibendum nunc vitae sem euismod malesuada. Praesent in neque fringilla, consequat leo quis, tincidunt odio. Maecenas ornare lacus id dui tincidunt tincidunt. Fusce aliquet orci nisi, a sodales sapien placerat eget. Nunc malesuada neque ipsum, vel tempor est sagittis vel. Morbi in dolor a est pharetra sodales quis eget metus. Ut quis rhoncus ante. Etiam viverra tortor sit amet vestibulum tempor. Phasellus eget nunc in enim porta facilisis. Morbi malesuada ipsum quis fringilla tempor. Sed at justo viverra, auctor mi vel, aliquet ex. Fusce eget risus purus. Fusce laoreet malesuada nunc.'
        },
        {
            name: 'c3',
            image: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/280h/6K7SIB380W.jpg',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc bibendum nunc vitae sem euismod malesuada. Praesent in neque fringilla, consequat leo quis, tincidunt odio. Maecenas ornare lacus id dui tincidunt tincidunt. Fusce aliquet orci nisi, a sodales sapien placerat eget. Nunc malesuada neque ipsum, vel tempor est sagittis vel. Morbi in dolor a est pharetra sodales quis eget metus. Ut quis rhoncus ante. Etiam viverra tortor sit amet vestibulum tempor. Phasellus eget nunc in enim porta facilisis. Morbi malesuada ipsum quis fringilla tempor. Sed at justo viverra, auctor mi vel, aliquet ex. Fusce eget risus purus. Fusce laoreet malesuada nunc.'
        }
    ];
function seedDB() {
    //remove all comments
    Comment.remove({}, function(err){
        if(!err) {
            console.log('SUCCESS: remove all comments'); 
            //Campground.remove() should be moved here
        } else {
            console.log('FAILED: remove all comments'); 
            console.log(err);
        }
    }); 
    //remove all campgrounds 
    Campground.remove({}, function(err){
        if(!err) {
            console.log('SUCCESS: remove all campgrounds in db');
            //add some, must be put inside this remove, because in JS, finish order is not guaranteed
            data.forEach(function(seed){
                Campground.create(seed,function(err, campground){
                    if(!err) {
                        console.log('SUCCESS: create a campground in db');
                        //console.log(campground);
                        Comment.create({
                            text: 'comment1',
                            author: 'author1'
                        },function(err, comment){
                            if(!err) {
                                console.log('SUCCESS: add a comment to db');
                                campground.comments.push(comment); 
                                campground.save(function(err){
                                    if(!err) {
                                        console.log('SUCCESS: comment pushed to a campground');
                                    } else {
                                        console.log('FAILED: comment pushed to a campground');
                                        console.log(err);
                                    }
                                });
                            } else {
                                console.log('FAILED: add a comment');
                                console.log(err);
                            }
                        });
                    } else {
                        console.log('FAILED: create a campground in db');
                        console.log(err);
                    }
                });
            });
        } else { 
            console.log('FAILED: remove all campgrounds in db');
            console.log(err);
        }
    });
    
}

module.exports = seedDB;