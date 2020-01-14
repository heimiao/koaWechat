const {
	api,
	wx
} = require('../config')
const axios = require('axios');
const crypto = require('crypto');
const CircularJSON = require('circular-json');
const NodeCache = require("node-cache");
const Cache = require('../tools/catch.js');

function strlog(key, value) {
	console.log(key, typeof(value) == "string" ? value : JSON.stringify(value));
}

// sha1加密
function sha1(str) {
	let shasum = crypto.createHash("sha1").update(str)
	str = shasum.digest("hex")
	return str
}
/**
 * 生成签名的时间戳
 * @return {字符串}
 */
function createTimestamp() {
	return parseInt(new Date().getTime() / 1000) + ''
}

/**
 * 生成签名的随机串
 * @return {字符串}
 */
function createNonceStr() {
	return Math.random().toString(36).substr(2, 15)
}

/**
 * 对参数对象进行字典排序
 * @param  {对象} args 签名所需参数对象
 * @return {字符串}    排序后生成字符串
 */
function raw(args) {
	var keys = Object.keys(args)
	keys = keys.sort()
	var newArgs = {}
	keys.forEach(function(key) {
		newArgs[key.toLowerCase()] = args[key]
	})
	var string = ''
	for(var k in newArgs) {
		string += '&' + k + '=' + newArgs[k]
	}
	string = string.substr(1)
	return string
}

var getSin = (ticket, paramUrl) => {
	/**
	 * 签名算法
	 * 签名生成规则如下：
	 * 参与签名的字段包括noncestr（ 随机字符串）,
	 * 有效的jsapi_ticket, timestamp（ 时间戳）,
	 * url（ 当前网页的URL， 不包含# 及其后面部分）。
	 * 对所有待签名参数按照字段名的ASCII 码从小到大排序（ 字典序） 后，
	 *  使用URL键值对的格式（ 即key1 = value1 & key2 = value2…） 拼接成字符串string1。
	 * 这里需要注意的是所有参数名均为小写字符。 对string1作sha1加密， 字段名和字段值都采用原始值， 不进行URL 转义。
	 */
	//整理需要排序的字段  
	var ret = {
		jsapi_ticket: ticket,
		nonceStr: createNonceStr(),
		timestamp: createTimestamp(),
		url: paramUrl
	};
	//安装ASCII码顺序“key=value&key=value”的字符串
	var mystring = raw(ret)
	console.log("排序", mystring);
	ret.signature = sha1(mystring)
	return ret;
}
////////////////////////////////////////////////////////////
//缓存判断请求
var asyncCatch = (access_tokenUrl, cacheName = "access_token") => {
	return new Promise((resolve, reject) => {
		var getcacheValue = Cache.getCache(cacheName);
		if(getcacheValue) {
			const result = Object.assign(getcacheValue, {
				from: 'cache'
			});
			console.log("从缓存获取 Data=", result);
			resolve(result);
		} else {
			axios.get(access_tokenUrl).then(res => {
				console.log("从远程获取 Data=", res.data);
				if(res.data.expires_in) {
					Cache.setCache(cacheName, res.data)
					resolve(res.data)
				} else {
					reject(res.data);
				}
			}).catch(errorData => {
				reject(errorData);
			});
		}
	})
}

//获取oauthToken
var getOauth2Access_token = async(ctx, next) => {
	var code = ctx.request.query.code;
	var AppID = wx.appId;
	var AppSecret =wx.appSecret;
	let access_tokenUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + AppID + '&secret=' + AppSecret + '&code=' + code + '&grant_type=authorization_code';
	return asyncCatch(access_tokenUrl, "oauth2Token").then(data => {
		if(data.access_token) ctx.oauthTokenData = data;
		return data
	}, errorData => {
		ctx.body = errorData
	})
}

//获取Nromaltoken
var getNormalAccess_token = async(ctx, next) => {
	var AppID = wx.appId;
	var AppSecret =wx.appSecret;
	var code = ctx.request.query.code;
	let access_tokenUrl = ' https://api.weixin.qq.com/cgi-bin/token?appid=' + AppID + '&secret=' + AppSecret + '&code=' + code + '&grant_type=client_credential';
	return asyncCatch(access_tokenUrl, "normalToken").then(data => {
		if(data.access_token) ctx.normalTokenData = data;
		return data
	}, errorData => {
		ctx.body = errorData
	})
}

//获取ticket
var getConfig = async(ctx, next) => {
	var url = ctx.request.query.url;
	var tokenData = await getNormalAccess_token(ctx, next);
	if(tokenData) {
		var rqstUrl = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + tokenData.access_token + "&type=jsapi";
		await asyncCatch(rqstUrl, "jsapi_ticket").then(data => {
			console.log("响应结果", data);
			if(data.ticket) {
				ctx.body = getSin(data.ticket, url);
			}
		}, errorData => {
			ctx.body = errorData
		})
	}
}

var getUser = async(ctx, next) => {
	var tokenData = await getOauth2Access_token(ctx, next);
	if(tokenData) {
		var accessToken = tokenData.access_token,
			openid = tokenData.openid;
		var getInfo = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + accessToken + '&openid=' + openid + '&lang=zh_CN';
		await axios.get(getInfo).then(args => {
			
			if(args.data.nickname) ctx.body = Object.assign(tokenData, args.data);
		}).catch(error => {
			ctx.body = error
		});
	}
}

var obj = {}
//obj[`GET /v1/getOpenId`] = [openId]
//obj[`GET ${api.user}`] = [userInfo]
obj[`GET /v1/getUser`] = [getUser]
obj[`GET /v1/getConfig`] = [getConfig]

module.exports = obj;