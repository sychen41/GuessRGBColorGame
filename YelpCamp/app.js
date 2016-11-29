var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment'),
    seedDB       = require('./seeds');
    
//mongoose.connect('mongodb://localhost/yelp_camp');
mongoose.connect('mongodb://admin:admin@ds111748.mlab.com:11748/ycdb');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); //dirname is the current directory path, sth like /home/ubuntu/workspace/YelpCamp

//init some dummy data to db
seedDB(); 

app.get('/', function(req, res){
    //res.render('landing');
    res.redirect('/campgrounds');
});

//INDEX(目录) route: show all campgrounds
app.get('/campgrounds', function(req, res){
    Campground.find({},function(err, campgrounds){
        if(!err) {
            console.log('SUCCESS: retrieve data from db');
            res.render('campgrounds/index', {campgrounds: campgrounds});
        }
        else {
            console.log('FAILED: retrieve data from db');
            console.log(err);
        }
    });
});

//NEW route: show form to create new campground
app.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new');
});

//SHOW route: shows more info about a specific campground
//note: this route MUST be after the NEW route, otherwise, 
//the 'new' in /XXXX/new will be treated as an id
app.get('/campgrounds/:id', function(req, res) {
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
app.post('/campgrounds', function(req, res) {
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

//===========================
//Comments routes
//NEW route: add new comment to a campground
app.get('/campgrounds/:id/comments/new', function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(!err) {
            console.log('SUCCESS: find campground by id for commenting');
            res.render('comments/new',{campground: foundCampground}); 
        } else {
            console.log('FAILED: find campground by id for commenting');
            console.log(err); 
        }
    });
});

//CREATE route: create comment
app.post('/campgrounds/:id/comments', function(req, res){
    Campground.findById(req.params.id, function(err, campground) {
        if(!err) {
            console.log('SUCCESS: retrieve the campground for adding comment');
            Comment.create(req.body.comment, function(err, comment){
                if(!err) {
                    console.log('SUCCESS: create new comment to be added to a campground');
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/'+req.params.id); 
                } else {
                    console.log('FAILED: create new comment to be added to a campground');
                    console.log(err); 
                }
            });    
        } else {
            console.log('FAILED: retrieve the campground for adding comment');
            console.log(err);
        }
    }); 
});

app.listen('8082', process.env.IP, function(){
    console.log('yelpcamp started');
});