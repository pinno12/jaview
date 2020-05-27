const express = require('express');
const router = express.Router();
const http =require("http");
const  mysql= require('mysql');
const dbconfig =require('../config/database').local;
const con = mysql.createConnection(dbconfig);

router.get('/', function(req, res){
    var userid = req.body.userid;
    res.render('privacy_policy.ejs');
});

module.exports = router;
