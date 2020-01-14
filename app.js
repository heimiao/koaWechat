const Koa = require('koa');
const app = new Koa();
const debug = require('debug')('koa-weapp-demo')
const bodyParser = require('koa-bodyparser')
const router = require('./router');
const config = require('./config')
var path = require('path');
var cors = require('koa2-cors');
const response = require('koa2-response');

//统一响应规则
//app.use(response);

app.use(
	cors({
		origin: function(ctx) { //设置允许来自指定域名请求
			return '*'; // 允许来自所有域名请求
		},
	})
);

// 使用响应处理中间件
app.use(async function(ctx, next) {
	try {
		// 调用下一个 middleware
		await next()
		// 处理响应结果
		// 如果直接写入在 body 中，则不作处理
		// 如果写在 ctx.body 为空，则使用 state 作为响应
		ctx.body = ctx.body ? ctx.body : {
			code: ctx.state.code !== undefined ? ctx.state.code : 0,
			data: ctx.state.data !== undefined ? ctx.state.data : {}
		}
	} catch(e) {
		// catch 住全局的错误信息
		debug('Catch Error:', e)
		// 设置状态码为 200 - 服务端错误
		ctx.status = 200
		// 输出详细的错误信息
		ctx.body = {
			code: -1,
			error: e && e.message ? e.message : e.toString()
		}
	}
})

// 解析请求体
app.use(bodyParser())

// 启动路由
app.use(router.routes()).use(router.allowedMethods())
// 以上为官方推荐方式，allowedMethods用在routes之后，作用是根据ctx.status设置response header.

app.use(require('koa-static')(path.join(__dirname, 'public')));

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))