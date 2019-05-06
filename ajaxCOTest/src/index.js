const ajaxCO = {
	jsonp(req, res) {
	  const data = req.query;
	  const body = data.callback + '("jsonp: ' + data.msg + '")';
	  res.set('Content-Type', 'text/javascript');
	  res.status(200).send(body);
	},
	
	iframePost(req, res, next) {
		const body = JSON.stringify(req.body);
		res.set('Content-Type', 'text/html');
  		res.status(200).send(body);
	},
	
	simplyCORS(req, res) {
		const body = 'simply CORS: ' + req.body.msg;
		res.set({
		  'Content-Type': 'text/plain',
		  'Access-Control-Allow-Credentials': 'true',
		  'Access-Control-Allow-Origin': 'http://127.0.0.1:8020'
		});
		res.cookie('lyl', '123456', { domain: 'http://localhost:8081', path: '/', HttpOnly: true});
  		res.status(200).send(body);
	},
	
	preDetect(req, res) {
		res.set({
			'Access-Control-Allow-Origin': 'http://127.0.0.1:8020',
		  'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS,HEAD',
		  'Access-Control-Allow-Headers': 'x-custom-header',
		  'Access-Control-Allow-Credentials': 'true',
		  'Access-Control-Max-Age': '1728000'
		});
  		res.status(200).send();
	},
	
	unsimplyCORS(req, res) {
		const body = 'unsimply CORS: ' + req.body.msg;
		res.set({
		  'Content-Type': 'text/plain',
		  'Access-Control-Allow-Credentials': 'true',
		  'Access-Control-Allow-Origin': 'http://127.0.0.1:8020'
		});
  		res.status(200).send(body);
	},
	
	proxy(req, res) {
	  const body = 'proxy server: ' + req.query.msg;
	  res.set('Content-Type', 'text/plain');
	  res.status(200).send(body);
	}
}

//--------------------------------------------------------------------------------------------------------------------------

var express = require('express');
var socket = require('socket.io');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('../'));	//静态资源

//router
app.get('/jsonp', ajaxCO.jsonp);

app.post('/iframePost', ajaxCO.iframePost);

app.post('/simplyCORS', ajaxCO.simplyCORS);

app.options('/unsimplyCORS', ajaxCO.preDetect);

app.put('/unsimplyCORS', ajaxCO.unsimplyCORS);

app.get('/proxy', ajaxCO.proxy);

//开启 http 服务器
var server = app.listen(8081, function () {
  console.log("应用实例已开启，访问地址为 http://localhost:8081");
});

//--------------------------------------------------------------------------------------------------------------------------
//开启 socket 服务
var io = socket.listen(server);

io.on('connection', function(socket) {
		console.log('Client socket has connected.'); 
		
    // 接收信息
    socket.on('message', function(msg) {
        socket.send('hello：' + msg);
        console.log('data from client: ---> ' + msg);
    });

    // 断开处理
    socket.on('disconnect', function() {
        console.log('Client socket has closed.'); 
    });
});

server.on('close', function() {
	io.close();
});
