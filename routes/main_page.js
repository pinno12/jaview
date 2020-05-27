const  mysql= require('mysql');
const express = require('express');
const router = express.Router();
function getRandomInt(min, max) { //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (max - min)) + min;
}

router.get('/', (req, res, next)=>{
	//let firstIndex = 25; 	/* 여기 세가지 인덱스만 바꾸면 대문 이미지 변경 가능*/
	//let secondIndex = 500;
	//let thirdIndex = 200;
	let firstIndex = getRandomInt(0,200);
	let secondIndex = getRandomInt(200, 500);
	let thirdIndex = getRandomInt(500, 700);

	getVideoId(firstIndex, secondIndex, thirdIndex).
	then(MvData=>{
        getCountGenre().
        then(countGenre=>{
            MvData.countGenre = countGenre;
            res.render('index', MvData);
        }), (error=>{
            console.log("Error get videoId : " +error);
        });
	}), (error=>{
		console.log("Error get videoId : " +error);
	});
});

let parseGenre = (result)=>{
	let ret = '';
	if(result.dance)
		ret +="#DANCE ";
	if(result.romance)
		ret +="#ROMANCE ";
	if(result.comedy)
		ret +="#COMEDY ";
	if(result.action)
		ret +="#ACTION ";
	if(result.act_etc)
		ret +="#ART ";
	return ret
};


let getVideoId = (firstIndex, secondIndex, thirdIndex)=> {
	return new Promise((resolve, reject)=>{
		const dbconfig =require('../config/database').local;
		const con = mysql.createConnection(dbconfig);
		con.connect(err=>{
			if (err) throw err;
			let sql = "(select * from MV_meta left join MV on MV_meta.mvId=MV.id limit "+firstIndex+" , 1) union ";
			sql += "(select * from MV_meta left join MV on  MV_meta.mvId=MV.id limit "+secondIndex+" , 1) union "
			sql += "(select * from MV_meta left join MV on  MV_meta.mvId=MV.id limit "+thirdIndex+" , 1)"
			con.query(sql, (err, result)=>{
                var raw_str = JSON.stringify(result);
                result = JSON.parse(raw_str);
				let _MvData = {
                    firstId : result[0].id,
                    secondId : result[1].id,
                    thirdId : result[2].id,
					firstMvImg: result[0].mainThumbnail,
					firstMvDirectorInfo : result[0].director,
					firstMvInfo: parseGenre(result[0]),
					firstMvSinger : result[0].singer,
                    firstMvTitle : result[0].title,
					secondMvImg : result[1].mainThumbnail,
					secondMvDirectorInfo : result[1].director,
					secondMvInfo: parseGenre(result[1]),
					secondMvSinger : result[1].singer,
                    secondMvTitle : result[1].title,
					thirdMvImg : result[2].mainThumbnail,
					thirdMvDirectorInfo : result[2].director,
					thirdMvInfo: parseGenre(result[2]),
					thirdMvSinger : result[2].singer,
                    thirdMvTitle : result[2].title,
				}
				resolve(_MvData);
				if(err) reject(err);
			});
		});
	});
};

let getCountGenre = (ids)=>{
	return new Promise((resolve, reject)=>{
		const dbconfig =require('../config/database').local;
		const con = mysql.createConnection(dbconfig);
		con.connect(err=>{
			if (err) throw err;
            const sql = "select sum(romance) as romance, sum(dance) as dance, sum(comedy) as comedy,"+
            " sum(action) as action, sum(drama) as drama, sum(art_etc) as special from MV";
            con.query(sql, (err, result)=>{
                let _countGenre = {
                    romance : result[0].romance,
                    dance : result[0].dance,
                    comedy : result[0].comedy,
                    action : result[0].action,
                    drama : result[0].drama,
                    special : result[0].special
                }    
				resolve(_countGenre);
				if(err) reject(err);
            });
		});
	});
}


module.exports = router;

