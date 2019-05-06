var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('./'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/a.html');
});

app.get('/search', function(req, res) {
	  res.set('Content-Type', 'text/html');
	  fs.readFile('a.html', function(err, data) {
	  	if(err) return console.log(err);
	  	const query = req.query;
	  	const body = data.toString().replace('{{keyword}}', encodeURIComponent(query.keyword))
	  		.replace('redirect', encodeURI(query.redirect));
	  	res.status(200).send(body);
	  })
});

app.listen(8001);