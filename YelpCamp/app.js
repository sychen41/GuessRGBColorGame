var express = require('express');
var app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    var campgrounds = [
        {name: 'acamp', image: 'http://www.goodnewsnetwork.org/wp-content/uploads/2015/07/running-dog-CC-DouglasMWeston.jpg'},
        {name: 'bcamp', image: 'https://files.graphiq.com/stories/t4/15_Tiniest_Dog_Breeds_1718_3083.jpg'},
        {name: 'ccamp', image: 'https://i.ytimg.com/vi/6j7oQletFbc/maxresdefault.jpg'}
    ];
    res.render('campgrounds', {campgrounds: campgrounds});
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('yelpcamp started');
});