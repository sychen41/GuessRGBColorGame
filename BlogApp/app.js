var express = require('express');
var app = express();
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressSanitizer = require('express-sanitizer'); //keep all html tags except the script tag in text

mongoose.connect('mongodb://admin:admin@ds111748.mlab.com:11748/ycdb');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true})); //parse req.body
app.use(expressSanitizer()); //MUST BE after bodyParser
app.use(methodOverride('_method'));//now you can use RESTful route http verb like put, delete

var blogSchema = new mongoose.Schema({
    title: String,
    image: String, //{type: String, default: 'somepicture.jpg'},
    body: String,
    dateCreated: {
        type: Date, 
        default: Date.now
    }
});
var Blog = mongoose.model('Blog', blogSchema);

//home page
app.get('/', function(req, res) {
    res.redirect('/blogs');
});

//INDEX
app.get('/blogs', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if(!err) {
            console.log('SUCCESS: retrieve data from db');
            res.render('index', {blogs: blogs});
        } else {
            console.log('FAILED: retrieve data from db');
            console.log(err);
        }
    });
});

//NEW
app.get('/blogs/new', function(req, res){
    res.render('new');
});

//CREATE
app.post('/blogs', function(req, res){
    //the way we setup the new, req.body.blog is already an object
    //so we don't need {title: req.body.title, image: req.......}
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err, blog){
        if(!err) {
            console.log('SUCCESS: add new blog to db');
            res.redirect('/blogs');
        } else {
            console.log('FAILED: add new blog to db');
            console.log(err);
        } 
    });
});

//SHOW
app.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(!err) {
            console.log('SUCCESS: retrieve a specific blog from db');
            res.render('show', {blog: foundBlog});
        } else {
            console.log('FAILED: retrieve a specific blog from db');
            console.log(err);
        }
    });
});

//EDIT
app.get('/blogs/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(!err) {
            console.log('SUCCESS: retrieve a specific blog to edit from db');
            res.render('edit', {blog: foundBlog});
        } else {
            console.log('FAILED: retrieve a specific blog to edit from db');
            console.log(err);
        }
    });
});

//UPDATE
app.put('/blogs/:id',function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if(!err) {
            console.log('SUCCESS: update a specific blog in db');
            res.redirect('/blogs/'+req.params.id);
        } else {
            console.log('FAILED: update a specific blog in db');
            console.log(err);
        }
    });
});

//DESTROY
app.delete('/blogs/:id', function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if(!err) {
            console.log('SUCCESS: delete a specific blog in db');
            res.redirect('/blogs/');
        } else {
            console.log('FAILED: delete a specific blog in db');
            console.log(err);
        }
    });
});

app.listen('8081', process.env.IP, function() {
    console.log('Blog app is running');
});