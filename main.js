var express = require('express');
var main_page = require("./routes/main_page");
var login = require("./routes/login");
var mypage = require("./routes/mypage");
var upload = require("./routes/upload");
var detail_page = require("./routes/detail");
var search_list_page = require("./routes/search_list");
var privacy_policy = require("./routes/privacy_policy");

var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : false}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
app.use('/build',express.static(__dirname + '/build'));

var server = app.listen(4200, function(){
	console.log("Express server has started on port 4200");
});

app.use('/', main_page);
app.use('/list', search_list_page);
app.use('/detail', detail_page);
app.use('/login', login);
app.use('/mypage', mypage);
app.use('/upload', upload);
app.use('/privacy_policy', privacy_policy);
//app.use('/mypage', mypage);
