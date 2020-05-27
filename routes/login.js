const express = require('express');
const router = express.Router();
const http =require("http");
const  mysql= require('mysql');
const dbconfig =require('../config/database').local;
const con = mysql.createConnection(dbconfig);

router.get('/', function(req, res){
    res.render('login.ejs');
});

router.post('/', (req, res)=>{
    var userid = req.body.userid;
    var username = req.body.username;
	console.log(userid);
	console.log(username);
	var sql= "INSERT INTO users (facebook_id, username) VALUES ('"+userid+"', '"+username+"') "+
			"ON DUPLICATE KEY UPDATE facebook_id='"+userid+"', recent_login=NOW()";
      con.query(sql, (err, result)=>{
        if (err) throw err;
		if(result) {
			res.send('success');
		}
    });
});

module.exports = router;
