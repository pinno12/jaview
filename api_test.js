s = require('express');
var app = express();
var client_id = 'b8VMw0rpUHnsez4xp2Sh';//개발자센터에서 발급받은 Client ID
var client_secret = 'vVwJathlza'; //개발자센터에서 발급받은 Client Secret
app.get('/search/news', function (req, res) {
      //  var api_url = 'https://openapi.naver.com/v1/search/blog?query=' + encodeURI(req.query.query);
          var api_url = 'https://openapi.naver.com/v1/search/news?query=%EB%A6%AC%EB%B7%B0&display=10&start=1&sort=sim' + encodeURI(req.query.query); //json 결과
             var request = require('request');
                var options = {
                           url: api_url,
                                  headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
                                      };
                                         request.get(options, function (error, response, body) {
                                                  if (!error && response.statusCode == 200) {
                                                             res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
                                                                    res.end(body);
                                                                         } else {
                                                                                    res.status(response.statusCode).end();
                                                                                           console.log('error = ' + response.statusCode);
                                                                                                }
                                                                                                   });
                                          });
 app.listen(3000, function () {
        console.log('http://127.0.0.1:3000/search/news?query="감독 뮤비 최신" app listening on port 3000!');
         });
 
