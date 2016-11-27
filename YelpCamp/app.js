var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose');

mongoose.connect('mongodb://localhost/yelp_camp');
//mongoose.connect('mongodb://admin:admin@ds111748.mlab.com:11748/ycdb');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//just a pattern, still flexible
var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

//create an object model with variables(like: name, image) and methods(like: CRUD methods)
var Campground = mongoose.model('Campground', campSchema);

app.get('/', function(req, res){
    res.render('landing');
});

//INDEX(目录) route: show all campgrounds
app.get('/campgrounds', function(req, res){
    Campground.find({},function(err, campgrounds){
        if(!err) {
            console.log('SUCCESS: retrieve data from db');
            res.render('index', {campgrounds: campgrounds});
        }
        else {
            console.log('FAILED: retrieve data from db');
            console.log(err);
        }
    });
});

//NEW route: show form to create new campground
app.get('/campgrounds/new', function(req, res){
    res.render('new');
});

//SHOW route: shows more info about a specific campground
//note: this route MUST be after the NEW route, otherwise, 
//the 'new' in /XXXX/new will be treated as an id
app.get('/campgrounds/:id', function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(!err) {
            console.log('SUCCESS: retrieve the user-chosen campground from db');
            res.render('show', {campground: foundCampground});
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


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('yelpcamp started');
});