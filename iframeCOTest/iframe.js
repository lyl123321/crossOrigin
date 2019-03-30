//1、跨域发起接口请求;
//2、跨域获取 DOM 或 JS 对象;
//3、跨域获取 Cookie、LocalStorage 和 IndexDB.

//注意：首先 node 两个 index.js ，然后打开 http://localhost:8001/a.html

/* 2.1 document.domain + iframe
 * 如果两个页面不同源，就无法拿到对方的 DOM 或 JS 对象。
 * 如果两个页面主域相同，只是子域不同， 那么这两个页面都通过 js 强制设置 document.domain 为基础主域，就实现了同域。
 * 这样就可以拿到对方的 DOM 或 JS 对象，并且共享 cookie 了。
 */

//2.2 location.hash + iframe 片段识别符
var iframe1 = document.getElementById('iframe1');
var originURL = iframe1.src;

function send(data) {
	iframe1.src = originURL + '#' + data;
}

// 开放给同域 c.html 的回调方法
function onCallback(res) {
  console.log('location.hash: ' + res);
}

setTimeout(send, 200, 'dsfdf');

//2.3 window.name + iframe
var proxy = function(url, fn) {
	var times = 0;
	var iframe = document.createElement('iframe');
	iframe.style = 'display: none';
	iframe.src = url;
	
	iframe.onload = function() {
		if(times === 0) {
			iframe.src = 'http://localhost:8001/c.html';
			//iframe.contentWindow.location = 'http://localhost:8001/c.html';
			times = 1;
		} else {
			fn(iframe.contentWindow.name);
			destoryIframe();
		}
	}
	
	document.body.appendChild(iframe);
	
	function destoryIframe() {
		iframe.contentDocument.write('');
		iframe.contentWindow.close();
		document.body.removeChild(iframe);
	}
}

proxy('http://localhost:8002/b.html', function(data) {
	console.log('window.name: ' + data);
});

/* 2.4 window.postMessage
 * postMessage 可用于解决以下方面的问题：
 * a.） 页面和其打开的新窗口的数据传递
 * b.） 多窗口之间消息传递
 * c.） 页面与嵌套的iframe消息传递
 * d.） 上面三个场景的跨域数据传递
 */
var msg = document.getElementById('msg');
var sub = document.getElementById('submit');
var iframe2 = document.getElementById('iframe2');

sub.addEventListener('click', function(event) {
	event.preventDefault();
	//iframe2.contentWindow：接收方窗口对象，它的 origin 应该与 targetOrigin：'http://localhost:8002' 相同
	iframe2.contentWindow.postMessage(msg.value, 'http://localhost:8002');
});

/*event:
 * 1、event.data：从其他 window 中传递过来的对象；
 * 2、event.origin: 发送消息的窗口的 origin；
 * 3、event.source: 对发送消息的窗口对象的引用。
 */
window.addEventListener('message', function(event) {
	if(event.origin !== 'http://localhost:8002') return;
	console.log('window.postMessage: ' + event.data);
});


/* 3.1 document.domain 跨域获取 Cookie
 * 只有同源的网页才能共享 Cookie。
 * 如果两个页面主域相同，只是子域不同， 那么这两个页面都通过 js 强制设置 document.domain 为基础主域，就实现了同域。
 * 这样就可以拿到对方的 DOM 或 JS 对象，并且共享 cookie 了。
 */

//3.2 window.postMessage 跨域获取 LocalStorage 或 IndexDB
var iframe3 = document.getElementById('iframe3');

setTimeout(storage, 100);

function storage() {
	var cw = iframe3.contentWindow;
	
	cw.postMessage(JSON.stringify({
		key: 'msg',
		value: {name: 'lyl', age: 21},
		method: "set"
	}), 'http://localhost:8002');
	
	cw.postMessage(JSON.stringify({
		key: 'msg',
		method: "get"
	}), 'http://localhost:8002');
	
	cw.postMessage(JSON.stringify({
		key: 'msg',
		method: "remove"
	}), 'http://localhost:8002');
}


