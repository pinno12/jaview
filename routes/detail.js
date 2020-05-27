const express = require('express');
const router = express.Router();
const http =require("http");
const  mysql= require('mysql');
const dbconfig =require('../config/database').local;
const con = mysql.createConnection(dbconfig);

router.get('/:id', (req, res)=>{
    var mvid = req.params.id;
   	getDetail(mvid). 
    then(MvData=>{
        res.render('detail', MvData);
    }), (error=>{
        console.log("Error get videoId : " +error);
    });
	getHit(mvid); 
});

router.post('/:id', (req, res)=>{
  var sql = "INSERT INTO Comment (mvId, userid, content) VALUES ("+req.body.mvId+", '"+req.body.userid+"', '"+req.body.content+"')";
  con.query(sql, (err, result)=>{
	if (err) throw err;
	res.redirect(req.get('referer'));
  });
});
router.get('/:id/likes', (req, res)=>{
	var mvid = req.params.id;
	var userid =req.query.userid;
	var sql = "SELECT * from likes where mvId="+mvid+" and userid='"+userid+"'";
	con.query(sql, (err, result)=>{
		if (err) throw err;
		if(result.length != 0){
			res.send('true');
		} else {
			res.send('false');	
		}
	});
});
router.post('/:id/likes', (req, res)=>{
	var mvid = req.params.id;
	var userid =req.body.userid;
	var sql = "INSERT INTO likes (mvId, userid) VALUES ("+mvid+", '"+userid+"')";
	con.query(sql, (err, result)=>{
		if (err) throw err;
		res.send(mvid);
	});
});
router.post('/:id/unlikes', (req, res)=>{
    var mvid = req.params.id;
    var userid =req.body.userid;
	var sql = "DELETE FROM likes where mvId="+mvid+" and userid='"+userid+"'";
	  con.query(sql, (err, result)=>{
		if (err) throw err;
		res.send(mvid);
	  });

});

router.post('/', (req, res, next)=>{
    let keyword = '빅뱅';
    let path ="/api/search?category=all&query=";
    path += encodeURI(keyword);
    
    let options = {
        host: "127.0.0.1",    
        port: 8000,
        path: path,
        method:"GET"
    };
    http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
        });
    }).end();
    let mvData = {
        'videoid' : 'MywIIbS4XU', 
		'director' : 'kim, lee',
		'genre' : 'romance',
		'title' : 'hello world',
		'singer' : 'world!',
		'description' : 'nonononon'
    };	
    res.render('detail', mvData);
});

let getDetail = (mvid)=> {
	return new Promise((resolve, reject)=>{
		const dbconfig =require('../config/database').local;
		const con = mysql.createConnection(dbconfig);
		let sql ="select * from MV where id="+mvid+";"+
		"select * from MV_meta where mvId="+mvid+";"+
		"select * from Comment c left join users u on  c.userid=u.facebook_id where mvId="+mvid+";"+
		"select * from MV_photos where MV_id="+mvid;
		con.query(sql,[1, 2, 3, 4], (err, result)=>{
			var res1 = result[0][0];
			var res2 = result[1][0];
			if(res2 ==null){
				res2={};
				res2.director="";
				res2.singer="";
			}
			var res3 = result[2];
			var res4 = result[3];
			let thumbnail_list = [];
			var videoid ="";
			for (var d in res4){
				thumbnail_list.push(imgCheck(res4[d].thumb_url));
			}
			try{
				videoid = res1.mainThumbnail.split('/vi/')[1].split('/')[0];
			} catch(err){
				videoid= res1.url.split('watch?v=')[1];
			} 
			console.log(res3);

			let _MvData = {
				'id': mvid, 
				'videoid': videoid,
				'url' : res1.url,
				'main_thumbnail' : res1.mainThumbnail,
				'thumbnail_list' : thumbnail_list,
				'director' : res2.director,
				'genre' : _parseGenre(res1),
				'singer'  : res2.singer,
				'title' : res1.title,
				'cast' : res1.cast,
				'description' : desc_collect(res1),
				'comments' : res3
			}
			resolve(_MvData);
			if(err) reject(err);
		});
	});
};
let getHit = (mvid)=> {
	return new Promise((resolve, reject)=>{
		const dbconfig =require('../config/database').local;
		const con = mysql.createConnection(dbconfig);
		let sql="UPDATE MV SET hit = hit+1 WHERE id="+mvid+";";
		con.query(sql, (err, result)=>{
			if(err) reject(err);
		});
	});
};
let _parseGenre = (result)=>{
    let ret = [];
    if(result.dance)
        ret.push('DANCE');
    if(result.romance)
        ret.push('ROMANCE');
    if(result.comedy)
        ret.push('COMEDY');
    if(result.action)
        ret.push('ACTION');
    if(result.drama || result.dramas){
        ret.push('DRAMA');
	}
    if(result.performance)
        ret.push('PERFORMANCE');
    if(result.art_etc)
        ret.push('ART');
    return ret
};

let desc_collect = (result)=> {
    let ret = {};
    ret['ppl'] = result.ppl;
    ret['story'] = result.story;
    ret['place'] = result.place;
    ret['cast'] = result.cast;
    return ret;
}

let imgCheck = (img)=>{
    if (img == "" || img ==undefined  ){
        return "https://s3.ap-northeast-2.amazonaws.com/jaview2017/images/thumbnails/etc/No_Youtube_photo.png";
    } 
    return img;
}

module.exports = router;
