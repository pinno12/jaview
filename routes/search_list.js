const express = require('express');
const router = express.Router();
const http = require("http");
const mysql = require('mysql');

router.get('/', (req, res, next)=>{
    let path="";
    let option = req.query.option;
    let query="";
    let genre = req.query.genre;
    let keyword = req.query.keyword;
    let order = req.query.order;

	if (genre != null){
		if (genre[0] =='performance'){
			genre[0] = 'dance';
		} 
	}
	if (keyword=='' && option == 'all'){
		option ='';

	}


    if(option == "all"){
        path = "/api/search?category=all&query=";
        query = "all";
    } else if (option =="singer"){
        path = "/api/search?category=singer&query=";
        query = "singer";
    } else if (option == "title") {
        path = "/api/search?category=title&query=";
        query = "title";
    } else if (option == "description") {
        path = "/api/search?category=desc&query=";
        query = "desc";
    } else if (option == "director") {
        path = "/api/search?category=director&query=";
        query = "director";
    }
    else {
        path = "/api/search?category=all&query=";
        query = "undefiend";
    }
	path += encodeURI(keyword);
	path += "&order="+order;

    let options = {
        host: "127.0.0.1",
        port: 8000,
        path: path,
        method: "GET",
        query : query,
        genre : genre,
    };
    getRequest(res, options, function(res, chunk){
        let filteredData = filterDataByGenre(options["query"],options["genre"], chunk);
        var ids = [];
        for (let d in filteredData['data']){
            ids.push(filteredData['data'][d].id);
        }
		getCountGenre(ids).
		then(countGenre=>{
			filteredData.countGenre = countGenre;
        	res.render('search_list', {option: options["query"], data : filteredData});
		}), (error=>{
			console.log("Error get videoId : " +error);
		});
    });
});

function filterDataByGenre(option,genre, chunk){
    var data=[];
    var result = [];
    if (option == "all"){
        data = data.concat(chunk["data"]["desc"]);
		data = data.concat(chunk["data"]["title"]);
		data = data.concat(chunk["data"]["director"]);
		data = data.concat(chunk["data"]["singer"]);
		data = data.filter(function(elem, pos) {
			return data.indexOf(elem) == pos;
		});
    } else if (option == ""){
        data = chunk["data"];
    }else{
        data = chunk["data"];
    }
    if(!genre){
        return {"data":data};
    }
    for (var i = 0;i < data.length; i++){
        for (var j=0; j<genre.length; j++) {
            if (data[i][genre[j]]) {
                result.push(data[i]);
                break;

            }
        }
    }
    return {"data":result};
}


function getRequest(res, options ,callback){
    http.request(options, function (response) {
        response.setEncoding('utf8');
        var data = "";
        response.on('data', function (chunk) {
            data += chunk;
        });
        response.on('end', function () {
            callback(res, JSON.parse(data))
        });
    }).end();
}

let getCountGenre = (ids)=>{
    return new Promise((resolve, reject)=>{
        const dbconfig =require('../config/database').local;
        const con = mysql.createConnection(dbconfig);
        con.connect(err=>{
            if (err) throw err;
			let sql = "select sum(dance) as performance, sum(dramas) as drama, sum(art_etc) as art from MV ";
            if(ids.length > 0){
                sql += "where id in (";
                for (var id in ids){
                    sql += ids[id] +" ,";
                }
                sql = sql.substring(0, sql.length-1);
                sql += ")";
            }
			else {
                let _countGenre = {
                    performance : 0,
                    drama : 0,
                    art : 0
                }
                resolve(_countGenre);
				
			}
            con.query(sql, (err, result)=>{
                let _countGenre = {
                    performance : result[0].performance,
                    drama : result[0].drama,
                    art : result[0].art
                }
                resolve(_countGenre);
                if(err) reject(err);
            });
        });
    });
}

module.exports = router;
