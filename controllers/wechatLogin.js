const {
	api,
	wx
} = require('../config')
const axios = require('axios');


var wechatLogin = async(ctx, next) => {
	//测试帐号信息
	var AppID = "wxf0604c1f99f9ad61";
	var appsecret = "ae82b74932bb47218bf3e4557754b18a";
	var router = 'canvas.html';
	// 这是编码后的地址
	var return_uri = encodeURI('http://aiddct.natappfree.cc/' + router);
	console.log(return_uri);
	//decodeURI(URIstring)
	var scope = 'snsapi_userinfo';
	ctx.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + AppID + '&redirect_uri=' + return_uri + '&response_type=code&scope=' + scope + '&state=STATE#wechat_redirect');
}


var wechatAuth2 = async(ctx, next) => {
	var signature = ctx.request.query.signature
	var timestamp = ctx.request.query.timestamp
	var nonce = ctx.request.query.nonce
	var echostr = ctx.request.query.echostr

	console.log(signature, timestamp, nonce, echostr);
}

var obj = {}
//obj[`GET ${api.wechatLogin}`] = {wechatLogin}
//obj[`GET /v1/wechatAuth2`] = {wechatAuth2}
module.exports = obj;