const cross = {
	jsonp(req, res) {
	  const data = req.query;
	  const body = data.callback + '("jsonp: ' + data.msg + '")';
	  res.cookie('tokenId', '1');
	  res.set('Content-Type', 'text/javascript');
	  res.status(200).send(body);
	},
	
	iframePost(req, res, next) {
		const data = req.body;
		const body = `<html><body>iframePost: ${JSON.stringify(data)}</body></html>`;
		res.set('Content-Type', 'text/html');
  	res.status(200).send(body);
	}
}

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var app = express();
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('../resource'));	//静态资源

app.get('/jsonp', function (req, res) {
  cross.jsonp(req, res);
});

app.post('/iframePost', upload.array(), function (req, res, next) {
  cross.iframePost(req, res, next);
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
});