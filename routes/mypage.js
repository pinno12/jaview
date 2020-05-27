const express = require('express');
const router = express.Router();
const http =require("http");
const  mysql= require('mysql');
const dbconfig =require('../config/database').local;
const con = mysql.createConnection(dbconfig);

router.post('/', function(req, res){
    var userid = req.body.userid;
	var sql = "select * from Comment c  left join MV m on m.id=c.mvId where c.userid='"+userid+"';"+
	" select * from likes l left join MV m on m.id=l.mvId where l.userid='"+userid+"';"+
	" select * from MV m left join MV_meta mm on mm.mvId=m.id where uploader='"+userid+"';"+
	" select * from likes l left join MV_meta mm on mm.mvId=l.mvId where l.userid='"+userid+"';";
	console.log(sql);
      con.query(sql,[1, 2, 3, 4], (err, result)=>{
        if (err) throw err;
		var comments = result[0];
		var likes = result[1];
		likes = _parseGenre(likes);
		var uploads = result[2];
		var likes_meta = result[3];
		console.log(uploads);
    	res.render('mypage.ejs', {'likes': likes, 'comments' : comments, 'uploads': uploads, 'likes_meta': likes_meta});
    });
});
router.post('/delete', function(req, res){
    var userid = req.body.userid;
	var sql = "DELETE from users where facebook_id='"+userid+"'";
      con.query(sql, (err, result)=>{
        if (err) throw err;
		res.send('delete me');
    });
});
let _parseGenre = (results)=>{
	let ret = [];
	for (var r in results){
		ret = [];
		let result = results[r];
		if(result.dance)
			ret.push('DANCE');
		if(result.romance)
			ret.push('ROMANCE');
		if(result.comedy)
			ret.push('COMEDY');
		if(result.action)
			ret.push('ACTION');
		if(result.drama || result.dramas)
			ret.push('DRAMA');
		if(result.performance)
			ret.push('PERFORMANCE');
		if(result.art_etc)
			ret.push('ART');
		results[r]['genre'] =ret
	}
	return results;
};

module.exports = router;
