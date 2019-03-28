//jsonp
const jsonp = function({url, data, jsonp}) {
	return new Promise((resolve, reject) => {
		// 处理传参成xx=yy&aa=bb的形式
		const handleData = function(data) {
			const keys = Object.keys(data);
			const keysLen = keys.length;
			
			return keys.reduce((acc, cur, index) => {
				const value = data[cur];
				const flag = index !== keysLen - 1 ? '&' : ''
				return `${acc}${cur}=${value}${flag}`;
			}, '');
		};
		
		// 动态创建script标签
		const script = document.createElement('script');
		jsonp = jsonp || 'jsonpCb';
		script.src = `${url}?${handleData(data)}&callback=${jsonp}`;
		document.body.appendChild(script);
		document.body.removeChild(script);
		
		// 接口返回的数据获取
		window.jsonpCb = function(res) {
			delete window.jsonpCb;
			resolve(res);
		}
	});
}

//jsonp测试
jsonp({
	url: 'http://localhost:8081/jsonp',
	data: {
		msg: 'helloJsonp'
	}
})
.then(res => console.log(res));