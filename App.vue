<script>
	// const playletPlugin = requirePlugin("playlet-plugin");
	let playletPlugin;

	// 检查当前是否在小程序环境中
	if (typeof wx !== 'undefined' && wx.getSystemInfo) {
		try {
			// 在小程序中执行 requirePlugin
			playletPlugin = requirePlugin("playlet-plugin");
		} catch (error) {
			console.error('Failed to requirePlugin in WeChat Mini Program:', error);
		}
	} else {
		// 在其他环境中的处理
		console.log('This code is executed only in WeChat Mini Program environment.');
	}
	const PlayerManager = require("./utils/playerManager.js");
	import apiMoen from './utils/config.js';
	// #ifdef APP-PLUS
	const request = require('./common/request/index').default
	const utils = require('./common/utils/index.js').default
	import checkappupdate from '@/common/utils/checkappupdate.js'
	import api from '@/common/request/api.js'
	// #endif

	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex"
	export default {
		usingComponents: {
			"charge-dialog": "/components/charge-dialog/charge-dialog",
			"open-area-left": "/components/open-area-left/open-area-left",
			"open-area-left-side": "/components/open-area-left-side/open-area-left-side",
			"open-area-right": "/components/open-area-right/open-area-right",
			"playlet-plugin": "/pages/playlet/playlet"
		},
		onLaunch: function(options) {
			this.submit();
			// #ifdef H5

			// #endif

			// #ifdef MP-WEIXIN
			// this.login()
			// #endif
			console.log("App Launch");
			playletPlugin.onPageLoad(this._onPlayerLoad.bind(this))
			//登录
			// 保存分享参数（H5、小程序）
			options.query.scene && this.setShare({
				spm: options.query.scene
			})
			// 获取配置信息
			// this.getConfigInfo()

			// #ifdef APP-PLUS
			// nvue变量
			this.request = request
			this.utils = utils
			// 锁定竖屏模式
			plus.screen.lockOrientation('portrait-primary');
			// app版本检测
			checkappupdate.check({
				api: this.$BASE_URL + api.common.update.url
			})
			// #endif

			// #ifdef H5
			// 非微信浏览器拦截
			const useragent = navigator.userAgent
			if (useragent.match(/MicroMessenger/i) != 'MicroMessenger') {
				// window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=888"
			}
			// #endif

			// #ifdef MP-WEIXIN
			// 朋友圈场景
			if (options.scene === 1155) {
				if (options.path != 'pages/home/index') {
					uni.switchTab({
						url: '/pages/home/index'
					})
				}
			}
			// 小程序更新
			const updateManager = uni.getUpdateManager()
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				console.log(res.hasUpdate, "版本检测");
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function(res) {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							success: res => {
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate()
								}
							}
						})
					})
					updateManager.onUpdateFailed(function(res) {
						// 新版本下载失败
						uni.showModal({
							title: '提示',
							content: '新版小程序下载失败\n请自行退出程序，手动卸载本程序，再运行',
							confirmText: "知道了"
						});
					})
				}
			})



			// #endif
		},
		onShow: function() {
			// console.log('App Show')
			// this.submit();
		},
		onHide: function() {
			// console.log('App Hide')
		},
		methods: {
			...mapActions("app", ["getConfigInfo"]),
			...mapMutations("app", ["setShare"]),

			longinopenid() {
				const mythis = this
				let newUrl = encodeURIComponent( apiMoen.MPWEIXIN + '/')
				let appid = apiMoen.gzhAppid
				let scope = 'snsapi_base'
				let code = this.getUrlCode().code; //是否存在code
				console.log(code, '1212222121212')
				if (code == null || code === "") {
					// return
					// let url_code = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxef1f84e3ab87ba11&redirect_uri="+ newUrl +"&response_type=code&scope=snsapi_base&state=STATE&wechat_redirect";
					let url_code =
						`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${newUrl}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`;
					console.log("url_code", url_code);
					window.location.href = url_code; //打开这个链接，你的url后面就会跟上code的参数
					console.log("url_code", url_code);
				} else {
					// this.submit()
					uni.setStorageSync('code', code)
					mythis.$request('login.getOpenIdByCode', {
						code: code,
						sysOrgCode: uni.getStorageSync('sysOrgCode'), //盼盼短剧
					}).then(res => {
						console.log('获取openid', res)
						if (res.code == 200) {
							uni.setStorageSync('openid', res.result)
						}
					})
					uni.switchTab({
						url: '/pages/home/index'
					})
				}
			},
			getUrlCode() {
				// 截取url中的code方法
				var url = location.search;
				var theRequest = new Object();
				if (url.indexOf("?") != -1) {
					var str = url.substr(1);
					var strs = str.split("&");
					for (var i = 0; i < strs.length; i++) {
						theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
					}
				}
				console.log(theRequest);
				return theRequest;
			},

			// H5登录
			submit() {
				const {
					deviceBrand,
					deviceModel,
					deviceId,
					osName,
					osVersion
				} = uni.getSystemInfoSync();
				console.log("登录参数", deviceId, apiMoen.sysOrgCode)
				var datas = {
					accountNumber: deviceId,
					sysOrgCode: apiMoen.sysOrgCode,
				};

				this.$request('common.memberAccountNumberAdd', datas).then(res => {
					// console.log("登录", res)
					if (res.code != 200) {
						uni.showToast({
							title: '系统异常登录失败',
							icon: 'none',
							duration: 2000 // 提示框显示时长
						});
					} else {
						// uni.showToast({
						// 	title: '登录成功',
						// 	icon: 'none',
						// 	duration: 2000 // 提示框显示时长
						// });
						const id = res.result.id
						const tenantId = res.result.tenantId
						const memberName = res.result.memberName
						const sysOrgCode = res.result.sysOrgCode
						uni.setStorageSync('id', id)
						uni.setStorageSync('tenantId', tenantId)
						uni.setStorageSync('sysOrgCode', sysOrgCode)
						console.log("登录111", res)
						// this.longinopenid()
						// uni.switchTab({
						// 	url: '/pages/home/index'
						// })
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// wx登录
			login() {
				console.log(apiMoen, 'apiMoen')
				//this指向问题
				const mythis = this
				uni.login({
					"provider": "weixin",
					"onlyAuthorize": true, // 微信登录仅请求授权认证
					success: function(event) {
						const {
							code
						} = event
						// console.log('获取小程序初始化基本信息code222222222222222222')
						console.log('获取小程序初始化基本信息code', code)
						console.log('获取小程序初始化基本信息event', event)
						mythis.$request('login.wxmpLogin', {
							code: code,
							appId: apiMoen.appId, //盼盼短剧
							// appId: 'wxd5208bc6883761bd',//迅捷剧场
						}).then(res => {
							console.log('获取小程序初始化基本信息我进到这儿了', res)
							if (res.code == 200) {
								//目前只是这样简单写
								// console.log('获取小程序初始化基本信息获取成功',res)
								const id = res.result.id
								const tenantId = res.result.tenantId
								const memberName = res.result.memberName
								const sysOrgCode = res.result.sysOrgCode
								const srcAppid = apiMoen.srcAppid //盼盼短剧
								// const srcAppid = 'wxd5208bc6883761bd'//迅捷剧场
								uni.setStorageSync('id', id)
								uni.setStorageSync('srcAppid', srcAppid)
								uni.setStorageSync('tenantId', tenantId)
								uni.setStorageSync('sysOrgCode', sysOrgCode)
							}
						})
					},
					fail: function(err) {
						// 登录授权失败
						// err.code是错误码
					}
				})
			},
			_onPlayerLoad(info) {
				const playerManager = new PlayerManager()
				playerManager._onPlayerLoad(info)
			},
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uview-ui/index.scss";
	@import "@/common/style/style.scss";
</style>