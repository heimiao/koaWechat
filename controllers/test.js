const {
	api,
	wx
} = require('../config')
const axios = require('axios');

function test1(ctx, next) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			var data = {
				name: "黑猫"
			}
			resolve()
			ctx.test = data;
		}, 1000)
	});
}

function test2(ctx, next) {
	console.log("test2", ctx.test);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				name: "黑猫1"
			})
			ctx.body = Object.assign(ctx.test, {
				age: 12
			});
		}, 1000)
	});
}

function test3(ctx, next) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			var data = {
				name: "test3"
			}
			resolve()
			ctx.test3 = data;
			next();
			console.log("next after=", ctx.body);
		}, 1000)
	});
}

async function test4(ctx, next) {
	console.log("test3", ctx.test3);
	//	ctx.body={name:ctx.test3}
	/*var test4Data = await new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(Object.assign({
				name: ctx.test3
			}, {
				age: 12
			}))
		}, 1000)
	});*/ 
	test4Data = {
		name: "test"
	}
	console.log("test4Data", test4Data);
	ctx.body = test4Data
}

var test = async(ctx, next) => {
	console.log("============test==========")
	await test1(ctx, next)
	await test2(ctx, next)
}

var obj = {}
obj[`GET /v1/test`] = [test]
obj[`GET /v1/testAll`] = [test3, test4]
module.exports = obj;