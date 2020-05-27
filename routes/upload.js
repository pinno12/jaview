const express = require('express');
const router = express.Router();
const http =require("http");
const  mysql= require('mysql');
const dbconfig =require('../config/database').local;
const con = mysql.createConnection(dbconfig);
var slack = require('slack-node');
var util = require('util');

webhookURL = "https://hooks.slack.com/services/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";
slack = new slack();
slack.setWebhook(webhookURL);

router.get('/', function(req, res){
    var userid = req.query.userid;
    res.render('upload.ejs', {'send' : 'none'});
});
router.post('/', function(req, res){
    var director = req.body.director;
    var singer = req.body.singer;
	var title = req.body.title;
    var link = req.body.link;
	var thumb0= req.body.thumb0;
	var thumb1= req.body.thumb1;
	var thumb2= req.body.thumb2;
	var thumb3= req.body.thumb3;
    var genre = req.body.genre;
    var diary = req.body.diary;
	var star = req.body.star;
	var product = req.body.product;
	var place = req.body.place;
	var story = req.body.story;
	var message = util.format('director : %s \n'+
		'singer : %s \n'+
		'title : %s \n'+
		'link : %s \n'+
		'thumb0 : %s \n'+
		'thumb1 : %s \n'+
		'thumb2 : %s \n'+
		'thumb3 : %s \n'+
		'genre : %s \n'+
		'diary : %s \n'+
		'star : %s \n'+
		'product : %s \n'+
		'place : %s \n'+
		'story : %s \n', director, singer, title, link, thumb0, thumb1, thumb2, thumb3, genre, diary, star, product, place, story);
	slack.webhook({
		channel : "#uploads",
		username : "uploadbot",
		text: message
	}, function(err, res){
		console.log(res);
	});
    res.render('upload.ejs', {'send' : 'success'});
});

module.exports = router;
