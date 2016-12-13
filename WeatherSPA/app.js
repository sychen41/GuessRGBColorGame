var express = require('express');
var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.get('/', function(req, res){
    res.render('index');
});

app.listen('8083', process.env.IP, function(){
    console.log('Weather SPA started...');
}); 