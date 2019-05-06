var vm = new Vue({
	el: '#app',
	data: {
		keyword: ''
	},
	methods: {
		submit(e) {
		}
	}
});

/* https://segmentfault.com/a/1190000016551188?utm_source=tag-newest
 * 
 * 一、XSS 攻击的两大要素：
 * 1、攻击者提交恶意代码；
 * 2、浏览器执行恶意代码。
 * 
 * 二、防范 XSS 攻击：
 * 1、防止攻击者提交恶意代码。
 * 使用输入过滤来防止攻击者提交恶意代码。
 * 输入过滤并非完全可靠，会引入很大的不确定性和乱码问题。
 * 但是在输入类型确定的时候(数字、URL、电话号码、邮件地址)使用输入过滤还是很有必要的。
 * 2、防止浏览器执行恶意代码。
 * 主要分为两部分：
 * i.防止 HTML（后台返回的响应 HTML 或者通过 innerHTML 插入的 HTML）被注入恶意代码；
 * ii.防止 JavaScript 执行恶意代码。
 * 2.1、防范存储型和反射型 XSS 攻击
 * 存储型和反射型 XSS 攻击都是在服务端取出恶意代码后，再将其插入到响应 HTML 中的。
 * 可以使用纯前端渲染或者转义 HTML 的方式来预防这两种攻击。
 * i.纯前端渲染：不由后台返回拼接后的 HTML，而是由前端通过 ajax 获取后台数据并更新。
 * 可以根据数据的类型调用相应的属性或方法（文本 textContent、属性 setAttribute）更新数据，这样就不会执行预期外的代码。
 * 但是还要防范 innerHTML 插入的 HTML（可以转义）和 DOM 型 XSS 攻击。
 * ii.转义 HTML：采用合适的转义库，对 HTML 模板各处插入点进行充分的转义。
 * 
 * 2.2、防范 DOM 型 XSS 攻击
 * 
 * 三、检测 XSS 攻击：
 * 1、使用通用 XSS 攻击字符串手动检测 XSS 漏洞。
 * 在网站的各输入框中提交这个字符串，或者把它拼接到 URL 参数上来进行检测。
 * https://github.com/0xsobky/HackVault/wiki/Unleashing-an-Ultimate-XSS-Polyglot
 * 2、使用扫描工具自动检测 XSS 漏洞。
 * Arachni: https://github.com/Arachni/arachni
 * Mozilla HTTP Observatory: https://github.com/mozilla/http-observatory/
 * w3af: https://github.com/andresriancho/w3af
 */
