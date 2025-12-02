const api = {
	// 公用
	common: {
		preloadDramaSeriesList: {
			url: '/api/appApi/preloadDramaSeriesList',
			method: 'GET',
			desc: '登录'
		},
		memberAccountNumberAdd: {
			url: '/api/appApi/memberAccountNumberAdd',
			method: 'GET',
			desc: '登录'
		},
		allocatProgram: {
			url: '/api/wxApi/allocatProgram',
			method: 'GET',
			desc: '小程序信息查询'
		},
		init: {
			url: '/addons/drama/index/init',
			method: 'GET',
			desc: '初始信息'
		},
		wxmpLogin: {
			url: '/addons/drama/user/wxMinilogin',
			method: 'POST',
			desc: '微信小程序登录'
		},
		pay: {
			url: '/addons/drama/pay/prepay',
			method: 'POST',
			desc: '支付'
		},
		upload: {
			url: '/addons/drama/index/upload',
			method: 'POST',
			desc: '上传文件'
		},
		richtext: {
			url: '/addons/drama/index/richtext',
			method: 'GET',
			desc: '协议内容'
		},
		wxmpQrcode: {
			url: '/addons/drama/share/qrcode',
			method: 'GET',
			desc: '微信小程序分享小程序码'
		},
		swiper: {
			url: '/addons/drama/block/index',
			method: 'GET',
			desc: '轮播图'
		},
		module: {
			url: '/addons/drama/module/index',
			method: 'GET',
			desc: '功能模块'
		},
		update: {
			url: '/addons/drama/index/version',
			method: 'GET',
			desc: 'app版本检测'
		},
		google: {
			url: '/api/sys/user/oauth2/verify-google',
			method: 'POST',
			desc: 'app版本检测'
		},
	},
	// 登录
	login: {
		//三方登录列表
		loginGAList: {
			url: '/api/sys/user/oauth2/providers',
			method: 'GET',
			desc: '三方登录列表'
		},
		//三方登录
		loginGA: {
			url: '/api/sys/user/oauth2/authorize',
			method: 'POST',
			desc: '三方登录'
		},
		//邮箱登录
		loginEmail: {
			url: '/api/sys/emailLogin',
			method: 'POST',
			desc: '邮箱登录'
		},
		//邮箱注册
		registerEmail: {
			url: '/api/sys/user/register',
			method: 'POST',
			desc: '邮箱注册'
		},
		//发送验证码
		sendEmailCode: {
			url: '/api/sys/sendEmailCode',
			method: 'POST',
			desc: '发送验证码'
		},
		wxmpLogin: {
			url: '/api/wxApi/filmDramaMemberAdd',
			method: 'GET',
			desc: '微信小程序登录'
		},
		getOpenIdByCode: {
			url: '/api/wxApi/getOpenIdByCode',
			method: 'GET',
			desc: '获取openid'
		},
		resetPasswordByEmail: {
			url: '/api/sys/user/resetPasswordByEmail',
			method: 'POST',
			desc: '重置密码'
		},
		sendEmailCode: {
			url: '/api/sys/sendEmailCode',
			method: 'POST',
			desc: '发送邮箱验证码'
		},
		// codeLogin: {
		// 	url: '/addons/drama/user/smsLogin',
		// 	method: 'POST',
		// 	desc: '验证码登录/注册'
		// },
		// register: {
		// 	url: '/addons/drama/user/smsRegister',
		// 	method: 'POST',
		// 	desc: '注册'
		// },
		// forgotPassword: {
		// 	url: '/addons/drama/user/forgotPwd',
		// 	method: 'POST',
		// 	desc: '找回密码'
		// },
		// sendCode: {
		// 	url: '/addons/drama/sms/send',
		// 	method: 'POST',
		// 	desc: '发送验证码'
		// },
		// wxBind: {
		// 	url: '/addons/drama/user/register',
		// 	method: 'POST',
		// 	desc: '微信授权后绑定手机号'
		// },
		// getWxMobile: {
		// 	url: '/addons/drama/user/getWxPhone',
		// 	method: 'POST',
		// 	desc: '获取微信手机号'
		// }
		verifyGoogle: {
			url: '/api/sys/user/oauth2/verify-google',
			method: 'POST',
			desc: '获取微信手机号'
		}
		
	},
	// 用户
	user: {
		info: {
			url: '/addons/drama/user/index',
			method: 'GET',
			desc: '个人信息'
		},
		vip: {
			url: '/addons/drama/vip/index',
			method: 'GET',
			desc: '会员规格'
		},
		updateInfo: {
			url: '/addons/drama/user/profile',
			method: 'POST',
			desc: '修改用户信息'
		},
		delete: {
			url: '/addons/drama/user/delete',
			method: 'GET',
			desc: '删除用户'
		},
		task: {
			url: '/addons/drama/task/index',
			method: 'GET',
			desc: '获取积分任务'
		},
		taskFinish: {
			url: '/addons/drama/task/add',
			method: 'POST',
			desc: '完成任务'
		},
		cdkey: {
			url: '/addons/drama/cryptocard/decrypt_card',
			method: 'GET',
			desc: '兑换卡密'
		},
		share: {
			url: '/addons/drama/wechat/jssdk',
			method: 'POST',
			desc: '微信公众号分享'
		},
		uploadFile: {
			url: '/api/appApi/uploadFile',
			method: 'POST',
			desc: '文件上传'
		},
		addFeedback: {
			url: '/api/appApi/addFeedback',
			method: 'POST',
			desc: '用户反馈'
		},
		feedbackList: {
			url: '/api/appApi/feedbackList',
			method: 'GET',
			desc: '用户反馈'
		},
		getUserInfo: {
			url: '/api/sys/user/getUserInfo',
			method: 'GET',
			desc: '用户信息'
		},
		appUpdateProfile: {
			url: '/api/sys/user/appUpdateProfile',
			method: 'PUT',
			desc: '修改用户信息'
		},
		deleteAccount: {
			url: '/api/sys/user/deleteAccount',
			method: 'POST',
			desc: '注销账号'
		},
		questionList: {
			url: '/api/appApi/qa/questionList',
			method: 'GET',
			desc: '查询问题列表'
		},
		questionAnswer: {
			url: '/api/appApi/qa/questionAnswer',
			method: 'GET',
			desc: '查询问题答案'
		},
	},
	// 视频
	video: {
		filmDramaById: {
			url: '/api/appApi/filmDramaById',
			method: 'GET',
			desc: '剧目详情'
		},
		selectByIdAndMemberId: {
			url: '/api/appApi/selectByIdAndMemberId',
			method: 'GET',
			desc: '根据剧集id查询剧集免费状态'
		},
		filmDramaSeriesList: {
			url: '/api/appApi/filmDramaSeriesList',
			method: 'GET',
			desc: '剧集列表'
		},
		handpickListApp: {
			url: '/api/appApi/handpickList',
			method: 'GET',
			desc: 'APP精选剧集'
		},
		handpickList: {
			url: '/api/appApi/handpickList',
			method: 'GET',
			desc: '精选剧集列表'
		},
		classify: {
			url: '/api/appApi/filmDlassifyList',
			method: 'GET',
			desc: '视频分类列表查询'
		},
		filmDramaList: {
			url: '/api/appApi/filmDramaList',
			method: 'GET',
			desc: '剧目列表查询'
		},
		menu: {
			url: '/addons/drama/video/detail',
			method: 'GET',
			desc: '节目单'
		},
		play: {
			url: '/addons/drama/video/getEpisodesUrl',
			method: 'POST',
			desc: '获取视频播放链接'
		},
		recommend: {
			url: '/api/wxApi/playLink',
			method: 'GET',
			desc: '获取视频'
		},
		filmLikeCollectList: {
			url: '/api/appApi/filmLikeCollectList',
			method: 'GET',
			desc: '获取收藏追剧列表'
		},
		filmViewHistoryList: {
			url: '/api/appApi/filmViewHistoryList',
			method: 'GET',
			desc: '获取观看历史列表'
		},
		addRecord: {
			url: '/addons/drama/video/log',
			method: 'POST',
			desc: '添加追剧和保存视频进度'
		},
		addOrEditLikeCollect: {
			url: '/api/wxApi/addOrEditLikeCollect',
			method: 'POST',
			desc: '添加追剧和取消追剧'
		},
		deleteRecord: {
			url: '/addons/drama/video/delLog',
			method: 'POST',
			desc: '取消追剧和删除播放记录'
		},
		getRecord: {
			url: '/addons/drama/video/logList',
			method: 'GET',
			desc: '获取播放记录'
		},
		likes: {
			url: '/api/appApi/filmDramaSeriesSecond',
			method: 'POST',
			desc: '点赞追剧'
		},
		carouselList: {
			url: '/api/allocat/allocatCarousel/list',
			method: 'POST',
			desc: '首页轮播图列表'
		},
		filmDlassifyList: {
			url: '/api/appApi/filmDlassifyList',
			method: 'GET',
			desc: '剧集分类列表'
		},
		videList: {
			url: '/api/appApi/filmDramaList',
			method: 'GET',
			desc: '分类剧集列表'
		},
	},
	//微信充值会员、金币
	wchatapi: {
		allocatRechargeList: {
			url: '/api/wxApi/allocatRechargeList',
			method: 'GET',
			desc: '查询充值设置'
		},
		rechargePackageList: {
			url: '/api/wxApi/rechargePackageList',
			method: 'GET',
			desc: '金币充值套餐列表'
		},
		orderAccountRechargeList: {
			url: '/api/wxApi/orderAccountRechargeList',
			method: 'GET',
			desc: '充值余额订单列表'
		},
		rechargePackage: {
			url: '/api/wxApi/rechargePackage',
			method: 'POST',
			desc: '金币充值'
		},
		vipPackageList: {
			url: '/api/appApi/vipPackageList',
			method: 'GET',
			desc: '会员充值套餐列表'
		},
		rechargeVip: {
			url: '/api/wxApi/rechargeVip',
			method: 'POST',
			desc: '会员充值'
		},
		vipEequityList: {
			url: '/api/wxApi/vipEequityList',
			method: 'GET',
			desc: '权益套餐列表'
		},
		orderVipRechargeList: {
			url: '/api/wxApi/orderVipRechargeList',
			method: 'GET',
			desc: '充值订单列表'
		},
		orderPayRechargeList: {
			url: '/api/wxApi/orderPayRechargeList',
			method: 'GET',
			desc: '消费订单列表'
		},
		allocatProgram: {
			url: '/api/wxApi/allocatProgram',
			method: 'GET',
			desc: '小程序信息'
		},
		allocatFunctionList: {
			url: '/api/wxApi/allocatFunctionList',
			method: 'GET',
			desc: '功能管理列表'
		},
		filmViewHistoryList: {
			url: '/api/appApi/filmViewHistoryList',
			method: 'GET',
			desc: '历史记录'
		},
		filmDramaMember: {
			url: '/api/appApi/filmDramaMember',
			method: 'GET',
			desc: '会员信息'
		},
		allocatProtocolList: {
			url: '/api/wxApi/allocatProtocolList',
			method: 'GET',
			desc: '协议管理列表'
		},
		allocatProtocolById: {
			url: '/api/wxApi/allocatProtocolById',
			method: 'GET',
			desc: '协议内容id查询'
		},
	},
	// 虚拟支付
	virtualPayment: {
		virtualPaymentNotifyUrl: {
			url: '/api/wxApi/virtualPaymentNotifyUrl',
			method: 'POST',
			desc: '虚拟支付-充值回调'
		},
		virtualPaymentPackage: {
			url: '/api/wxApi/virtualPaymentPackage',
			method: 'POST',
			desc: '虚拟支付-充值虚拟币'
		},
		virtualPaymentVip: {
			url: '/api/wxApi/virtualPaymentVip',
			method: 'POST',
			desc: '虚拟支付-充值会员'
		}
	},
	// 案例
	case: {
		classify: {
			url: '/addons/drama/archives/cotegory',
			method: 'GET',
			desc: '分类'
		},
		list: {
			url: '/addons/drama/archives/index',
			method: 'GET',
			desc: '列表'
		},
		detail: {
			url: '/addons/drama/archives/show',
			method: 'GET',
			desc: '详情'
		}
	},
	// 订单 (vip)
	order: {
		list: {
			url: '/addons/drama/vip_order/index',
			method: 'GET',
			desc: '列表'
		},
		detail: {
			url: '/addons/drama/vip_order/detail',
			method: 'GET',
			desc: '详情'
		},
		create: {
			url: '/addons/drama/vip_order/recharge',
			method: 'POST',
			desc: '生成订单'
		}
	},
	// 分销商
	dealer: {
		info: {
			url: '/addons/drama/user/userData',
			method: 'GET',
			desc: '分销商信息'
		},
		level: {
			url: '/addons/drama/reseller/index',
			method: 'GET',
			desc: '等级'
		},
		orderList: {
			url: '/addons/drama/reseller/order_list',
			method: 'GET',
			desc: '订单记录'
		},
		orderDetail: {
			url: '/addons/drama/reseller/order_detail',
			method: 'GET',
			desc: '订单详情'
		},
		createOrder: {
			url: '/addons/drama/reseller/recharge',
			method: 'POST',
			desc: '创建订单'
		},
		superior: {
			url: '/addons/drama/share/add',
			method: 'GET',
			desc: '添加上级'
		}
	},
	// 积分
	integral: {
		list: {
			url: '/addons/drama/usable/index',
			method: 'get',
			desc: '积分套餐'
		},
		record: {
			url: '/addons/drama/user_wallet_log/index',
			method: 'GET',
			desc: '积分流水记录'
		},
		create: {
			url: '/addons/drama/usable/recharge',
			method: 'post',
			dessc: '创建订单'
		}
	},
	// 分享
	share: {
		record: {
			url: '/addons/drama/share/index',
			method: 'GET',
			desc: '分享记录'
		},
		team: {
			url: '/addons/drama/reseller/user',
			method: 'GET',
			desc: '团队'
		},
		teamNum: {
			url: '/api/appDivideApi/getTeamData',
			method: 'GET',
			desc: '团队统计'
		},
		teamNew: {
			url: '/api/appDivideApi/getTeamDataList',
			method: 'GET',
			desc: '团队列表'
		},
		brokerage: {
			url: '/addons/drama/reseller/log',
			method: 'GET',
			desc: '佣金'
		}
	},
	// 提现
	withdraw: {
		account: {
			url: '/addons/drama/user_bank/info',
			method: 'GET',
			desc: '提现账户'
		},
		addAccount: {
			url: '/addons/drama/user_bank/edit',
			method: 'POST',
			desc: '添加提现账户'
		},
		record: {
			url: '/addons/drama/user_wallet_apply/index',
			method: 'GET',
			desc: '提现记录'
		},
		apply: {
			url: '/addons/drama/user_wallet_apply/apply',
			method: 'POST',
			desc: '提现申请'
		},
		rule: {
			url: '/addons/drama/user_wallet_apply/rule',
			method: 'GET',
			desc: '提现规则'
		},
		goldCoinExchangeDetailList: {
			url: '/api/wxApi/goldCoinExchangeDetailList',
			method: 'GET',
			desc: '积分兑换金币明细'
		},
		goldCoinExchange: {
			url: '/api/appApi/goldCoinExchange',
			method: 'POST',
			desc: '积分兑换金币'
		},
		getBalance: {
			url: '/api/appDivideApi/getBalance',
			method: 'GET',
			desc: '获取余额'
		},
		rechargeDetailList: {
			url: '/api/wxApi/rechargeDetailList',
			method: 'GET',
			desc: '点数储值明细列表'
		},
		consumptionDetailList: {
			url: '/api/wxApi/consumptionDetailList',
			method: 'GET',
			desc: '我的钱包明细列表'
		},
	},
	// 播放会员充值购买
	player: {
		filmDlassifyList: {
			url: '/api/wxApi/filmDlassifyList',
			method: 'GET',
			desc: '分类列表查询'
		},
		rechargePackageList: {
			url: '/api/wxApi/rechargePackageList',
			method: 'GET',
			desc: '充值套餐列表'
		},
		rechargePackage: {
			url: '/api/wxApi/rechargePackage',
			method: 'POST',
			desc: '购买虚拟币'
		},
		filmDramaMember: {
			url: '/api/wxApi/filmDramaMember',
			method: 'GET',
			desc: '查询会员信息'
		},
		buyDramaSeries: {
			url: '/api/wxApi/buyDramaSeries',
			method: 'POST',
			desc: '购买剧集'
		},
	},
	// 账户管理
	accountKeeper: {
		filmDramaMember: {
			url: '/api/wxApi/filmDramaMember',
			method: 'GET',
			desc: '会员信息查询'
		},
		orderVipRechargeList: {
			url: '/api/wxApi/orderVipRechargeList',
			method: 'GET',
			desc: '充值订单列表-充值记录'
		},
		orderPayRechargeList: {
			url: '/api/wxApi/orderPayRechargeList',
			method: 'GET',
			desc: '消费订单列表-消费记录'
		}
	},
	//搜索
	serach: {
		filmDramaMember: {
			url: '/api/appApi/filmDramaList',
			method: 'GET',
			desc: '查找剧集并记录搜索历史'
		},
		searchHistoryList: {
			url: '/api/appApi/searchHistoryList',
			method: 'GET',
			desc: '查找搜索历史记录'
		},
		clearSearchHistory: {
			url: '/api/appApi/clearSearchHistory',
			method: 'DELETE',
			desc: '清空搜索历史'
		},
		searchRecommendedList: {
			url: '/api/appApi/searchRecommendedList',
			method: 'GET',
			desc: '热点搜索词'
		},
		hotDramaList: {
			url: '/api/appApi/hotDramaList',
			method: 'GET',
			desc: '热门剧集推荐API'
		},
	},
	sign:{
		memberGoldCoin: {
			url: '/api/appSignInApi/memberGoldCoin',
			method: 'GET',
			desc: '金币余额查询API'
		},
		signinManageList: {
			url: '/api/appSignInApi/signinManageList',
			method: 'GET',
			desc: '金币余额查询API'
		},
		addSigninWelfare: {
			url: '/api/appSignInApi/addSigninWelfare',
			method: 'GET',
			desc: '立即签到API'
		},
	}
}

export default api;