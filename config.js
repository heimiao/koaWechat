const CONF = {
	port: '80',
	rootPathname: '',
	wx: {
		// 微信小程序 App ID
		appId: 'wxb42d34d27d9c093a',
		// 微信小程序 App Secret
		appSecret: 'ae82b74932bb47218bf3e4557754b18a',
	},
	api: {
		login: "/v1/login",
		user: "/v1/user",
		wechatLogin: "/v1/wechatLogin",
		getUserByCode: "/v1/saveInfo"
		
	},
	/**
	 * MySQL 配置，用来存储 session 和用户信息
	 * 若使用了腾讯云微信小程序解决方案
	 * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
	 */
	mysql: {
		host: 'localhost',
		port: 3306,
		user: 'root',
		db: 'cAuth',
		pass: 'wxde040d315860b2ce',
		char: 'utf8mb4'
	},
}

module.exports = CONF