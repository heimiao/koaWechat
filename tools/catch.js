const NodeCache = require("node-cache");

const myCache = new NodeCache({
	stdTTL: 7200, // 缓存过期时间
	checkperiod: 120 // 定期检查时间
});

// 设置缓存
var setCache = function(key, value) {
	// 设置缓存
	return myCache.set(key, value);
};

// 获取缓存
var getCache = function(key) {
	return myCache.get(key); 
};

module.exports = {
	setCache: setCache,
	getCache: getCache
};