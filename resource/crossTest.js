//简单的跨域请求jsonp即可，复杂的cors，窗口之间JS跨域postMessage，开发环境下接口跨域用nginx反向代理或node中间件比较方便。
//1、跨域发起接口请求
//2、跨域获取 DOM 或 JS 对象
//3、跨域获取 Cookie、LocalStorage 和 IndexDB
//1.1、jsonp 跨域发起 get 请求
const jsonp = function({url, data}) {
	return new Promise((resolve, reject) => {
		// 处理传参成xx=yy&aa=bb的形式
		const handleData = function(data) {
			const keys = Object.keys(data);
			const keysLen = keys.length;
			
			return keys.reduce((acc, cur, index) => {
				const value = data[cur];
				const flag = index !== keysLen - 1 ? '&' : '';
				return `${acc}${cur}=${value}${flag}`;
			}, '');
		};
		
		// 动态创建script标签
		const script = document.createElement('script');
		script.src = `${url}?${handleData(data)}&callback=jsonpCb`;
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

//1.2、空 iframe 加 form 跨域发起 post 请求
const iframePost = function({url, data}) {
	const iframe = document.createElement('iframe');
	iframe.name = 'iframePost';
	iframe.style.display = 'none';
	document.body.appendChild(iframe);
	iframe.onload = function() {
		console.log('success post');
		console.log(iframe.contentWindow.document.body.textContent);
	}
	
	const form = document.createElement('form');
	const node = document.createElement('input');
	form.action = url;
	form.method = 'post';
	form.target = iframe.name;
	form.style.display = 'none';
	
	for(let key of Object.keys(data)) {
		node.name = key;
		node.value = data[key];
		form.appendChild(node.cloneNode());
	}
	
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

iframePost({
	url: 'http://localhost:8081/iframePost',
	data: {
		id: 'lyl',
		psw: '123456'
	}
});
