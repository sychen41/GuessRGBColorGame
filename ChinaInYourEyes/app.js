var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    methodOverride  = require('method-override'),
    passport        = require('passport'),
    localStrategy   = require('passport-local'), 
    Landscape       = require('./models/landscape'),
    Comment         = require('./models/comment'),
    User            = require('./models/user'),
    flash           = require('connect-flash'),
    seedDB          = require('./seeds');
    
var commentRoutes       = require('./routes/comments'),
    landscapeRoutes    = require('./routes/landscapes'),
    indexRoutes          = require('./routes/index');


mongoose.connect('mongodb://admin:admin@ds111748.mlab.com:11748/ycdb');
//mongoose.connect(process.env.DATABASEURL || 'mongodb://localhost/ciye');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); //dirname is the current directory path, sth like /home/ubuntu/workspace/ChinaInYourEyes
app.use(methodOverride('_method'));
app.use(flash());

//init some dummy data to db
//seedDB(); 

//passport config
app.use(require('express-session')({
    secret: 'sometimes I wish I were a dog',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//use middleware to make req.user availble to all (like a global) so we don't
//need to pass it to every route.
function passUserInfoToAllResponses(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.info = req.flash('info');
    res.locals.currentPath = req.path;
    next();
}
app.use(passUserInfoToAllResponses);

//routes
app.use('/', indexRoutes); //which is the same as app.use(indexRoutes);
app.use('/landscapes', landscapeRoutes);
app.use('/landscapes/:id/comments', commentRoutes);

app.listen('8082', process.env.IP, function(){
    console.log('China In Your Eyes started');
});