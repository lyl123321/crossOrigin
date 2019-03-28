const cross = {
	//jsonp
	jsonp(req, res) {
	    const query = req.query;
	    const msg = 'Hello ' + query.user;
	    const body = query.callback + '("' + msg + '")';
	    res.set('Content-Type', 'text/javascript');
	    res.status(200).send(body);
	}
}

export cross;