var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var campgrounds = [
    {name: '1camp', image: 'http://www.goodnewsnetwork.org/wp-content/uploads/2015/07/running-dog-CC-DouglasMWeston.jpg'},
    {name: '2camp', image: 'https://files.graphiq.com/stories/t4/15_Tiniest_Dog_Breeds_1718_3083.jpg'},
    {name: '3camp', image: 'https://i.ytimg.com/vi/6j7oQletFbc/maxresdefault.jpg'},
    {name: '4camp', image: 'http://www.goodnewsnetwork.org/wp-content/uploads/2015/07/running-dog-CC-DouglasMWeston.jpg'},
    {name: '5camp', image: 'https://files.graphiq.com/stories/t4/15_Tiniest_Dog_Breeds_1718_3083.jpg'},
    {name: '6camp', image: 'https://i.ytimg.com/vi/6j7oQletFbc/maxresdefault.jpg'},
    {name: '7camp', image: 'http://www.goodnewsnetwork.org/wp-content/uploads/2015/07/running-dog-CC-DouglasMWeston.jpg'},
    {name: '8camp', image: 'https://files.graphiq.com/stories/t4/15_Tiniest_Dog_Breeds_1718_3083.jpg'},
    {name: '9camp', image: 'https://i.ytimg.com/vi/6j7oQletFbc/maxresdefault.jpg'}
];

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    res.render('campgrounds', {campgrounds: campgrounds});
});

app.get('/campgrounds/new', function(req, res){
    res.render('newCampground');
});

app.post('/campgrounds', function(req, res) {
    campgrounds.push({
        name: req.body.name,
        image: req.body.image
    });     
    res.redirect('/campgrounds');
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('yelpcamp started');
});