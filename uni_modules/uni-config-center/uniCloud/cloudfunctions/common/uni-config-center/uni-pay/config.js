const fs = require('fs');
const path = require('path')
module.exports = {
	// 统一 - 支付回调地址,格式为 "服务空间ID":"URL化地址"
	"notifyUrl": {		
		 // 线上环境服务空间-支付回调地址（如果只有一个服务空间，则只需要配置线上环境服务空间即可）
		"mp-1a08e3a2-f4a0-4ae1-a16e-c2292fd2cc69":"https://fc-mp-1a08e3a2-f4a0-4ae1-a16e-c2292fd2cc69.next.bspapp.com/uni-pay-co",
	},
	"notifyKey":"5FB2CD73C7B53918728417C50762E6D45FB2CD73C7B53918728417C50762E6D4", // 跨云函数通信时的加密密钥，建议手动改下，不要使用默认的密钥，长度保持在64位以上即可
	// 微信支付相关
	"wxpay": {
		"enable": true, // 是否启用微信支付
		// 微信 - 小程序支付
		"mp": {
			"appId": "wxda2c3eef7d7e3413", // 小程序的appid
			"secret": "90c74aae689afea712c2c68df3bdec0c", // 小程序的secret
			"mchId": "1677087719", // 商户id
			"key": "", // v2的api key
			"pfx": fs.readFileSync(__dirname + '/wxpay/apiclient_cert.p12'), // v2需要用到的证书
			"v3Key": "79700500177AC4EDE9054157448D53BA", // v3的api key
			"appCertPath": path.join(__dirname, 'wxpay/apiclient_cert.pem'), // v3需要用到的证书
			"appPrivateKeyPath": path.join(__dirname, 'wxpay/apiclient_key.pem'), // v3需要用到的证书
			"version": 3, // 启用支付的版本 2代表v2版本 3 代表v3版本
		},
		// 微信 - APP支付
		"app": {
			"appId": "", // app开放平台下的应用的appid
			"secret": "", // app开放平台下的应用的secret
			"mchId": "", // 商户id
			"key": "", // v2的api key
			"pfx": fs.readFileSync(__dirname + '/wxpay/apiclient_cert.p12'), // v2需要用到的证书
			"v3Key": "", // v3的api key
			"appCertPath": path.join(__dirname, 'wxpay/apiclient_cert.pem'), // v3需要用到的证书
			"appPrivateKeyPath": path.join(__dirname, 'wxpay/apiclient_key.pem'), // v3需要用到的证书
			"version": 2, // 启用支付的版本 2代表v2版本 3 代表v3版本
		},
		// 微信 - 扫码支付
		"native": {
			"appId": "wxda2c3eef7d7e3413", // 可以是小程序或公众号或app开放平台下的应用的任意一个appid
			"secret": "90c74aae689afea712c2c68df3bdec0c", // secret
			"mchId": "1677087719", // 商户id
			"key": "", // v2的api key
			"pfx": fs.readFileSync(__dirname + '/wxpay/apiclient_cert.p12'), // v2需要用到的证书
			"v3Key": "79700500177AC4EDE9054157448D53BA", // v3的api key
			"appCertPath": path.join(__dirname, 'wxpay/apiclient_cert.pem'), // v3需要用到的证书
			"appPrivateKeyPath": path.join(__dirname, 'wxpay/apiclient_key.pem'), // v3需要用到的证书
			"version": 3, // 启用支付的版本 2代表v2版本 3 代表v3版本
		},
		// 微信 - 公众号支付
		"jsapi": {
			"appId": "wxda2c3eef7d7e3413", // 公众号的appid
			"secret": "90c74aae689afea712c2c68df3bdec0c", // 公众号的secret
			"mchId": "1677087719", // 商户id
			"key": "", // v2的api key
			"pfx": fs.readFileSync(__dirname + '/wxpay/apiclient_cert.p12'), // v2需要用到的证书
			"v3Key": "79700500177AC4EDE9054157448D53BA", // v3的api key
			"appCertPath": path.join(__dirname, 'wxpay/apiclient_cert.pem'), // v3需要用到的证书
			"appPrivateKeyPath": path.join(__dirname, 'wxpay/apiclient_key.pem'), // v3需要用到的证书
			"version": 3, // 启用支付的版本 2代表v2版本 3 代表v3版本
		},
		// 微信 - 手机外部浏览器H5支付
		"mweb": {
			"appId": "", // 可以是小程序或公众号或app开放平台下的应用的任意一个appid
			"secret": "", // secret
			"mchId": "", // 商户id
			"key": "", // v2的api key
			"pfx": fs.readFileSync(__dirname + '/wxpay/apiclient_cert.p12'), // v2需要用到的证书
			"v3Key": "", // v3的api key
			"appCertPath": path.join(__dirname, 'wxpay/apiclient_cert.pem'), // v3需要用到的证书
			"appPrivateKeyPath": path.join(__dirname, 'wxpay/apiclient_key.pem'), // v3需要用到的证书
			"version": 2, // 启用支付的版本 2代表v2版本 3 代表v3版本
			// 场景信息，必填
			"sceneInfo": {
				"h5_info": {
					"type": "Wap", // 此值固定Wap
					"wap_url": "", // 你的H5首页地址，必须和你发起支付的页面的域名一致。
					"wap_name": "", // 你的H5网站名称
				}
			}
		},
	},
	// 支付宝相关（加签方式选证书模式，加密算法选RSA2）
	"alipay": {
		"enable": true, // 是否启用支付宝支付
		// 支付宝 - 小程序支付配置
		"mp": {
			"appId": "", // 支付宝小程序appid
			"privateKey": "", // 支付宝商户私钥
			"appCertPath": path.join(__dirname, 'alipay/appCertPublicKey.crt'), // 支付宝商户公钥路径
			"alipayPublicCertPath": path.join(__dirname, 'alipay/alipayCertPublicKey_RSA2.crt'), // 支付宝公钥路径
			"alipayRootCertPath": path.join(__dirname, 'alipay/alipayRootCert.crt'), // 支付宝根证书路径
		},
		// 支付宝 - APP支付配置
		"app": {
			"appId": "", // 支付宝开放平台下应用的appid
			"privateKey": "", // 支付宝商户私钥
			"appCertPath": path.join(__dirname, 'alipay/appCertPublicKey.crt'), // 支付宝商户公钥路径
			"alipayPublicCertPath": path.join(__dirname, 'alipay/alipayCertPublicKey_RSA2.crt'), // 支付宝公钥路径
			"alipayRootCertPath": path.join(__dirname, 'alipay/alipayRootCert.crt'), // 支付宝根证书路径
		},
		// 支付宝 - H5支付配置（包含：网站二维码、手机H5，需申请支付宝当面付接口权限）
		"native": {
			"appId": "2021004155690222", // 支付宝开放平台下应用的appid
			"privateKey": "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCojE0KgXLu09Pz9jvMJtSaFDkqvsjzxjHN6z8/6y7Afn1dV4B30nx3DoTnzg9LYfBN0mU26idwySnBd+3KUWhNSmt89r6Mc3AuzKsElWrgYCQgrAeBn2170sCeQkNeN4KHx3yPAutNscvbZclClcnSdjh96h0YLfso4W8TJN3IabHeLyeopEKUr+zZgKkBzoCYGbLdK7AzsHMGd/pj3rdy+Wz01pJuMlfm2LjlvPGJ6Rez6ga+aRjDuBhGfzjxFzUdfR9wphHsnwKCN6jNOQKuI26GhJcRZLKixWgC8h3ZVGt32KtpUnBwiF7HbvEUdkfwDCN4po3sX0i+XqreK3GpAgMBAAECggEALBqSakZXSdFaLANpwFEE3tCd6OaFdOyOycBeC57B3BL9QPiNoE0OzqSY+IM+E06sb+C3JXh+G5A4Ae0c5w0ISvlHSSrTz7LBTy21Lnzeu5nMulPpnuyV3InYZ1EVicjiuh7kJBPyeKEmo+FtmaPSbOUMgT5KoLIff6IFy6+g7Tj2YGXAAYX8UX+l+itlYSi5TDNX/oLNOvuFe3sr7HKR/QXY1aLpdRo7/0LP2zNQISXC6USUWmc6wcIeNFOPHkRQEN93ZXnX1NR0QtIu9ZIfAbdnVAP6otoR7ptSxUfcCibZJoMXy2NxhanKkJvXJjRMmjwMyh6xYDoNT0O4HMWKEQKBgQDRXkHVPCBY7MZjKx9PcTxOVOQnG8VW6Y0zb98R36pcQiQi5iK3xHzpSnuoGt+/eGS2dKed9Z2aPwE0IFxi/8Zh0NzP1z+ma8Sq0WRdvRyeZsuKJ785XUb8OkvVAA3DCWlr0JCFGb30ty8R6XM6NX4TxWX/zNoLE/odcrtbNcMRtQKBgQDOFpA9bln/TyalWG8uDmmV3PkGZBpasjB/XE8GDLarxzC13DCmlDeOzZV92ymyUqJ1eV3h6QfYfVOx/832pwcTgHaRei6dUqlVJhufYT5I1+3+Bm//grGjHG2NNdEfad83SN+mMRQeb/zv+q8IbACgRGAFsXMKUWUhmju8NPHopQKBgQDNDIxbQ3TGwrYVf7E9g8A1U0zTxI4D7d69Zq5I+g4GJzzu9QdBhW10qd7rp85E3qt8SkmzGU9ONrB+FceFqczoFb98yunqmpdVWJf8em8h77keSIkurF0OQCXuqQvRXVFjJzOzN5/joNi3qTSR6LverzCTU1SlDt6horE9xiyTFQKBgBLJ/daL9AqR1c0nVeOWDsxJ/C43/CseqctCyDWd/R2GKIu8Cnd1dedAGQwDajbGz+bz7LpG+58iNfo5fzaonb2KbcTvpcZUHfoUYlpSjFIp1ZneTmG2ManUUqyYJnu9tEsfCrzlJpdr0Fy0tzaGWjxCX5rFRd6/8v9wR1fuX8u9AoGAcOfTzWn1DGR5Zo/8LO6lkikZ32RwH4W2Gt3hbu1yHgXJ3MHaiizEjCeMx1oQ5+zn01ac//kh00vrGOPzUWgkpcYEMNzCa5v2asFf18dBVFyksqRc9GBuhwG3m+ftggXT9tOT2YMouhlA4NzwaDm1vSRp8Jk7TZC56++DnAusvhk=", // 支付宝商户私钥
			"appCertPath": path.join(__dirname, 'alipay/appCertPublicKey.crt'), // 支付宝商户公钥路径
			"alipayPublicCertPath": path.join(__dirname, 'alipay/alipayCertPublicKey_RSA2.crt'), // 支付宝公钥路径
			"alipayRootCertPath": path.join(__dirname, 'alipay/alipayRootCert.crt'), // 支付宝根证书路径
		}
	},
	// ios内购相关
	"appleiap" :{
		// ios内购支付
		"app": {
			"password": "", // App 专用共享密钥，App 专用共享密钥是用于接收此 App 自动续期订阅收据的唯一代码。如果您要将此 App 转让给其他开发者或不想公开主共享密钥，建议使用 App 专用共享密钥。非自动续订场景不需要此参数
			"timeout": 10000, // 请求超时时间，单位：毫秒
			"sandbox": false, // 是否是沙箱环境（本地调试ios走的是沙箱环境，故要设置为true，正式发布后，需要设置为false）
		}
	}
}
