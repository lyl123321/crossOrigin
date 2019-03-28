var express = require('express');

const cross = {
	jsonp(req, res) {
	    const query = req.query;
	    const msg = 'READ: ' + query.msg;
	    const body = query.callback + '("' + msg + '")';
	    res.set('Content-Type', 'text/javascript');
	    res.status(200).send(body);
	}
}

var app = express();

app.use(express.static('../resource'));

app.get('/jsonp', function (req, res) {
    cross.jsonp(req, res);
})

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("应用实例，访问地址为 http://%s:%s", host, port)

});