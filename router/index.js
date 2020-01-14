const Router = require('koa-router');
//const router = require('koa-router')();
// 或 单独创建router的实例
const fs = require('fs');
var path = require('path');

//将路由
function addMapping(router, mapping) {
	for(var url in mapping) {
		if(url.startsWith('GET ')) {
			var path = url.substring(4);
			router.get(path, ...mapping[url]);
			console.log(`register URL mapping: GET ${path} `);
		} else if(url.startsWith('POST ')) {
			var path = url.substring(5);
			router.post(path, ...mapping[url]);
			console.log(`register URL mapping: POST ${path}`);
		} else {
			console.log(`invalid URL: ${url}`);
		}
	}
}

function addControllers(router) {
	var defpath = path.join(__dirname, '../');
	var files = fs.readdirSync(defpath + '/controllers');
	var js_files = files.filter((f) => {
		return f.endsWith('.js');
	});
	for(var f of js_files) {
		console.log(`process controller: ${f}...`);
		let mapping = require(defpath + '/controllers/' + f);
		addMapping(router, mapping);
	}
}

let controllers_dir = 'controllers',
router = new Router(); // 如果不传参数，扫描目录默认为'controllers'
addControllers(router, controllers_dir);

module.exports = router