//简单的跨域请求jsonp即可，复杂的cors，窗口之间JS跨域postMessage，开发环境下接口跨域用nginx反向代理或node中间件比较方便。
//1、跨域发起接口请求;
//2、跨域获取 DOM 或 JS 对象;
//3、跨域获取 Cookie、LocalStorage 和 IndexDB.

//注意：首先在 src 目录下 node index 和 proxy，然后直接用 HBuilder 打开  index.html， HBuilder 默认服务器为 http://127.0.0.1:8020

//1.1 jsonp 跨域发起 get 请求
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

jsonp({
	url: 'http://localhost:8081/jsonp',
	data: {
		msg: 'hello jsonp'
	}
})
.then(res => console.log(res));

//1.2 form + iframe 跨域发起 post 请求(获取不到响应)
const iframePost = function({url, data}) {
	const iframe = document.createElement('iframe');
	iframe.name = 'iframePost';
	iframe.style.display = 'none';
	document.body.appendChild(iframe);
	iframe.onload = function() {
		console.log('iframePost: success post, but you cannot get response');
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

//1.3 Websocket 协议
//跨域全双工通信协议，见 socket.html

/* 1.4 CORS 跨域资源共享
 * 跨域发起接口请求的标准解决方案。
 * CORS 请求默认不发送 Cookie 和 HTTP 认证信息，如需发送 Cookie，则要求前后端设置携带 cookie。
 * 需要注意的是，如果要发送 Cookie，Access-Control-Allow-Origin 就不能设为星号，必须指定明确的、与请求网页一致的域名。
 * 同时，Cookie 依然遵循同源政策！！，只有用服务器域名设置的 Cookie 才会上传，其他域名的 Cookie 并不会上传，
 * 且（跨源）原网页代码中的 document.cookie 也无法读取服务器域名下的Cookie。
 * 而且服务器要求浏览器设置的 cookie 也是服务器源对应的 cookie。
 */
/* 1.4.1 简单请求
 * 1、method: HEAD, GET 和 POST;
 * 2、HTTP 头信息可包含的字段: Accept, Accept-Language, Content-Language, Last-Event-ID;
 * 3、以及 Content-Type：只限于三个值 pplication/x-www-form-urlencoded、multipart/form-data、text/plain.
 * 不满足其中任何一条，就是非简单请求。
 * CORS 简单请求的头信息特殊字段：Origin 字段。
 * CORS 响应中特殊的头信息字段：
 * 1、Access-Control-Allow-Origin
 * 2、Access-Control-Allow-Credentials
 * 是否允许浏览器请求携带服务器源对应的 cookie
 * 3、Access-Control-Expose-Headers
 * 设置 xhr.getResponseHeader() 方法能够拿到的 CORS 响应中的头信息字段
 */
var xhr1 = new XMLHttpRequest();
xhr1.withCredentials = true;	//携带 cookie

xhr1.open('POST', 'http://localhost:8081/simplyCORS');
xhr1.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr1.send('msg=this is a simply CORS');
xhr1.onreadystatechange = callback;

/* 1.4.2 非简单请求
 * 非简单请求会在正式通信之前，增加一次"预检"请求。返回码是204，预检测通过才会真正发出请求，这才返回200。
 * 预检请求：
 * 1、method: OPTIONS;
 * 2、头信息特殊字段：Origin、Access-Control-Request-Method 和 Access-Control-Request-Headers
 * 预检请求的响应：
 * 头信息特殊字段：Access-Control-Allow-Origin、Access-Control-Allow-Methods、Access-Control-Allow-Headers、
 * Access-Control-Allow-Credentials 和 Access-Control-Max-Age 
 * (Max-Age 指定本次预检请求的有效期，单位为秒,在此期间，不用再发出另一条预检请求)。
 * 接下来的 CORS 非简单请求和 CORS 非简单请求响应的头信息特殊字段和 CORS 简单请求中的一样。
 */
var xhr2 = new XMLHttpRequest();
xhr2.withCredentials = true;

xhr2.open('PUT', 'http://localhost:8081/unsimplyCORS');
xhr2.setRequestHeader('X-Custom-Header', 'value');
xhr2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr2.send('msg=this is not a simply CORS');
xhr2.onreadystatechange = callback;

/* 1.5 代理服务器
 * 跨域原理： 同源策略是浏览器的安全策略，不是HTTP协议的一部分。服务器端调用HTTP接口只是使用HTTP协议，不会执行JS脚本，
 * 不需要同源策略，也就不存在跨越问题。
 * 实现方法：配置一个代理服务器（域名相同，端口不同）做跳板机，浏览器请求同源的代理服务器，再由代理服务器请求外部服务接口。
 * 代理服务器有 nginx 代理服务器、Nodejs 中间件等。需要先打开 proxy 服务器 http://localhost:3000。
 */
var xhr3 = new XMLHttpRequest();
xhr3.withCredentials = true;

// 访问 http-proxy-middleware 代理服务器
xhr3.open('get', 'http://localhost:3000/proxy?msg=ajax through proxy server');
xhr3.send();
xhr3.onreadystatechange = callback;

function callback() {
	if (this.readyState === 4 && this.status === 200) {
    console.log(this.response);
  }
}