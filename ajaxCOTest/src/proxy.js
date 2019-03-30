var express = require('express');
var proxy = require('http-proxy-middleware');
var app = express();

app.use('/', proxy({
	// 代理跨域目标接口
  target: 'http://localhost:8081',
  changeOrigin: true,

  // 修改响应头信息，实现跨域并允许带cookie
  onProxyRes: function(proxyRes, req, res) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.header('Access-Control-Allow-Credentials', 'true');
  },
  
  // 修改响应信息中的cookie域名，这样服务器就可以设置 浏览器中此域名下的 cookie 了？？？
  cookieDomainRewrite: '127.0.0.1'  // 可以为false，表示不修改
}));

//开启 proxy 服务器
app.listen(3000);