<template>
	<view class="centert-lsty">
		<view class="c-top">
			<view class="color-az" v-if="platform === 'Android'">支持作者创作，当前内容需要解锁后观看</view>
			<view class="color-az" v-if="platform === 'iOS'">IOS苹果用户暂不支持付费解锁功能</view>
		</view>
		<view class="c-yminsoer" v-if="platform == 'Android'">
			<view class="solonun">余额：{{falishui.totalBalance || 0}}</view>
			<view class="moinun">
				解锁本集:<span>{{mainList.price || 0}}</span>{{falishui.currencyName}}，解锁整部剧
				<span>{{mainList.totalPrice || 0}}</span>{{falishui.currencyName}}。
			</view>
		</view>
		<!-- 充值虚拟币 -->
		<view class="mon-list" v-if="platform == 'Android'">
			<view class="moinuns-view" v-for="(item,index) in mainList.list" @click="matbBtotton(index,item)">
				<view class="mv-ones">
					<view class="">
						<span style="font-size: 34rpx;">{{item.packageMoney}}</span>元
					</view>
					<view class="coloir">{{item.rechargeCoins}}{{falishui.currencyName}}</view>
				</view>
				<view class="mv-two">
					额外赠送{{item.giftCoins}}{{falishui.currencyName}}
				</view>
			</view>
		</view>
		<!-- 开通VIP -->
		<view class="mon-list" v-if="platform == 'Android'">
			<view class="moinuns-view" v-for="(items,index) in memberList" @click="handleToActive(index,items)">
				<view class="mv-ones">
					<view class="">
						<span style="font-size: 34rpx;">{{items.packageMoney}}</span>元
					</view>
					<view class="coloir">{{items.rechargeCoins}}</view>
				</view>
				<view class="mv-two">
					{{items.packageDescribe}}
				</view>
			</view>
		</view>

		<!-- <view class="moinunstile">
			选择支付方式(虚拟商品不支持退款，未满18岁未成年人禁止充值)
		</view> -->
		<!-- <view class="moinunsdiv">
			<view class="ouinmino">
				<image src="../../static/weixin.png" mode=""></image>
				<view>微信支付</view>
			</view>
		</view> -->
		<view class="act_prompt" v-if="platform == 'Android'">
			<view class="pro_title">
				温馨提示
			</view>
			<view class="text">
				1.充值的开通的VIP会员及{{falishui.currencyName}}充值仅限于本剧场使用。
			</view>
			<view class="text">
				2.在播剧目总数：<span class="tt">{{videoList.length || 0}}</span>，开通VIP免费观看！
			</view>
			<view class="text">
				3.充值比例：1元兑换{{allocatRechargeList.proportSetUp || "100"}}{{allocatRechargeList.currencyName || ""}}，赠送的{{allocatRechargeList.currencyName || ""}}，有效期为{{allocatRechargeList.termSetUp || 0}}天，有效期到后赠送{{allocatRechargeList.currencyName || ""}}置0。
			</view>
			<view class="text">
				4.开通VIP会员及{{falishui.currencyName}}充值前，请先阅读<navigator url="/pages/user/about/about"
					hover-class="navigator-hover">
					<span class="tt">《会员服务协议》</span>。
				</navigator>
			</view>
			<view class="text">
				5.未满18周岁的未成年人应在法定监护人同意后开通VIP或{{falishui.currencyName}}充值。
			</view>
			<view class="text">
				6.充值的VIP及{{falishui.currencyName}}属于虚拟商品，不支持退换。
			</view>
			<view class="text">
				7.开通VIP会员代表您已同意<navigator url="/pages/user/about/about" hover-class="navigator-hover">
					<span class="tt">《用户协议》</span>和<span class="tt">《隐私政策》</span>.
				</navigator>
			</view>
			<view class="text">
				8.{{falishui.currencyName}}充值代表您已同意<navigator url="/pages/user/about/about"
					hover-class="navigator-hover">
					<span class="tt">《用户协议》</span>和<span class="tt">《隐私政策》</span>.
				</navigator>
			</view>
		</view>
		<view class="" style="height: 140rpx;"></view>
	</view>
</template>

<script>
	import api from '@/utils/config.js'
	const jweixin = require('jweixin-module')
	import PlayletManager from '../../utils/playerManager.js'
	// var plugin = requirePlugin("playlet-plugin");
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
	var MYurl = 'http://bxduanju.natapp1.cc'
	export default {
		data() {
			return {
				// 当前平台信息
				memberList: [],
				equityList: [],
				ativoeIndex: -1,
				mainList: [],
				falishui: {},
				data: {
					_isInitChargeDialog: false,
					chargeList: [],
					selectIndex: -1,
					playerId: this.playerId,
				},
				serialNos: null,
				userCode: '',
				tenantId: api.tenantId,
				sysOrgCode: api.sysOrgCode,
				allocatRechargeList: {},
				videoQuery: {
					tenantId: api.tenantId,
					sysOrgCode: api.sysOrgCode,
					dramaClassify: "", //短剧分类
					dramaChannel: "", //频道分类
				},
				videoList: [],
				platform: '',
				openid:'ogvdF6U0Z36PmXdEg7QQEO6Tfh1w',
			}
		},
		components: {},
		props: {
			playerId: {
				type: String,
				value: ''
			},
			srcAppid: {
				type: String,
				value: ''
			},
			dramaId: {
				type: String,
				value: ''
			},
			serialNo: {
				type: Number,
				value: 0
			},
			extParam: {
				type: String,
				value: ''
			},
		},
		created() {
			this.certerList()
			this.getVipPackageList()
			this.filmDramaMember()
			this.getAllocatRechargeList()
		},
		watch: {
			serialNo(serialNo) {
				this.getSystemInfo()
				// 当集数发生改变的时候，触发此函数
				this.serialNos = serialNo
				this.certerList()
				this.filmDramaMember()
				this.getVipPackageList()
				// this.filmDramaMember(),
				this.getAllocatRechargeList()
				this.getVideoList()
				console.log(serialNo, '12121212')
				// console.log(this.serialNo, '3333333333333333444')
			},
			playerId(playerId) {
				console.log('this.initChargeDialog', playerId)
				this.initChargeDialog()
			}
		},
		onLoad() {
			this.getSystemInfo()
			this.filmDramaMember()
			this.getAllocatRechargeList()
			this.buySkit()
			this.getWxCode()
			this.getVipPackageList()
			this.getVideoList()
		},
		methods: {
			// 获取平台信息
			getSystemInfo(){
				const systemInfo = uni.getSystemInfoSync();
				let platform;
				
				if (systemInfo.platform === 'android') {
					this.platform = 'Android';
				} else if (systemInfo.platform === 'ios') {
					this.platform = 'iOS';
				}else if (systemInfo.platform === 'devtools'){
					this.platform = 'Android';
				}
				console.log("输出设备平台信息systemInfo",systemInfo); // 输出设备平台信息
				console.log("输出设备平台信息",this.platform); // 输出设备平台信息
			},
			// 获取视频列表的长度
			getVideoList() {
				this.$request('video.filmDramaList', this.videoQuery).then(res => {
					// console.log("视频列表:", res);
					if (res.code != 200) {
						uni.showToast({
							title: '视频列表获取失败',
							icon: 'none',
							duration: 2000 // 提示框显示时长
						});
					}
					this.videoList = res.result
					console.log("this.videoList视频列表:", this.videoList);
				}).catch(err => {
					console.log(err)
				})
			},
			// 查询充值设置
			getAllocatRechargeList() {
				this.$request('wchatapi.allocatRechargeList', {
					memberId: api.tenantId,
					sysOrgCode: api.sysOrgCode,
				}).then(res => {
					if (res != 200 && res.message != "") {
						uni.showToast({
							title: res.message,
							icon: 'error',
							duration: 2000,
						});
					}
					this.allocatRechargeList = res.result
					console.log('查询充值设置:', res);
				})
			},
			// 关闭弹窗
			closePopup() {
				const that = this
				that.hideChargeDialog()
				// // 刷新列表
				// that.filmDramaMember()
				// 购买剧集
				setTimeout(function() {
					// 数据加载完毕，关闭加载中的Toast
					that.onCheckIsCanPlay()
					// uni.hideLoading();
					// 执行其他逻辑...
				}, 2000); // 假设这里是异步加载数据，3秒后完成
			},
			// 开通VIP
			// VIP充值套餐列表
			getVipPackageList() {
				this.$request('wchatapi.vipPackageList', {
					tenantId: api.tenantId,
					sysOrgCode: this.sysOrgCode
				}).then(res => {
					if (res.code == 200) {
						this.memberList = res.result
					}
				}).catch(res => {
					console.log(res);
				})
			},
			getWxCode(callback) {
				wx.login({
					success: (res) => {
						if (res.code) {
							this.userCode = res.code;
							if (callback) {
								callback(this.userCode);
							}
						} else {
							console.log('获取失败！' + res.errMsg);
						}
					}
				});
			},
			// 虚拟支付开通VIP
			async handleToActive(index, items) {
				const userCode = await new Promise((resolve, reject) => {
					this.getWxCode((userCode) => {
						resolve(userCode); // 将 userCode 传递给 Promise 的 resolve 函数
					});
				});
				this.activeIndex = index;
				// 目前只有 >= v2.19.2 的基础库支持该接口，后续将对更多低版本基础库支持该接口。因此建议开发者这样判断：当前用户的基础库版本 >= v2.19.2 时可以直接用 wx.requestVirtualPayment，小于 v2.19.2 时，用 wx.canIUse('requestVirtualPayment') 来判断接口是否可用。
				function compareVersion(_v1, _v2) {
					if (typeof _v1 !== 'string' || typeof _v2 !== 'string') return 0
					const v1 = _v1.split('.')
					const v2 = _v2.split('.')
					const len = Math.max(v1.length, v2.length)
					while (v1.length < len) {
						v1.push('0')
					}
					while (v2.length < len) {
						v2.push('0')
					}
					for (let i = 0; i < len; i++) {
						const num1 = parseInt(v1[i], 10)
						const num2 = parseInt(v2[i], 10)

						if (num1 > num2) {
							return 1
						} else if (num1 < num2) {
							return -1
						}
					}
					return 0
				}

				const SDKVersion = wx.getSystemInfoSync().SDKVersion
				const self = this; // 在外部保存正确的上下文
				var data = {
					buyQuantity: 1, //购买数量
					goodsPrice: items.packageMoney, //充值金额
					productId: items.id, //充值会员id 即是套餐id
					memberId: uni.getStorageSync('id'), //会员id
					sysOrgCode: api.sysOrgCode,
					tenantId: this.tenantId, //运营主体公司id
					code: userCode
				}
				this.$request('virtualPayment.virtualPaymentVip', data).then(res => {
					console.log('充值会员', res)
					if (compareVersion(SDKVersion, '2.19.2') >= 0 || wx.canIUse('requestVirtualPayment')) {
						wx.requestVirtualPayment({
							signData: JSON.stringify(res.result.signData),
							// signData: JSON.stringify({
							// 	offerId: '123', //在米大师侧申请的应用 id, mp-支付基础配置中的offerid
							// 	buyQuantity: 1, //购买数量
							// 	env: 1, //环境配置, 0 米大师正式环境, 1 米大师沙箱环境, 默认为 0
							// 	currencyType: 'CNY', //人民币
							// 	productId: 'testproductId', //道具ID
							// 	goodsPrice: 10, //道具单价(分)
							// 	outTradeNo: 'xxxxxx', //业务订单号
							// 	attach: 'testdata', //透传数据, 发货通知时会透传给开发者
							// }),
							paySig: res.result.paySig, //支付签名
							signature: res.result.signature, // 用户态签名
							mode: res.result
								.mode, //支付类型 道具直购：short_series_goods	代币充值：short_series_coin	
							success() {
								console.log('会员开通成功，准备支付回调', res)
								console.log('会员开通成功，准备支付回调', res.result.signData.outTradeNo)
								// return
								// const outTradeNo = res.result.signData.outTradeNo
								var dataToSend = {
									attach: res.result.signData.attach,
									buyQuantity: res.result.signData.buyQuantity,
									currencyType: res.result.signData.currencyType,
									env: res.result.signData.env,
									goodsPrice: res.result.signData.goodsPrice,
									offerId: res.result.signData.offerId,
									outTradeNo: res.result.signData.outTradeNo,
									productId: res.result.signData.productId
								};
								// 支付成功回调
								self.$request('virtualPayment.virtualPaymentNotifyUrl', dataToSend)
									.then(res => {
										console.log('支付回调数据', res.code)
										if (res.success) {
											uni.showToast({
												icon: 'success',
												title: this.$t('toast.member_open_success')
											})
											pm.hideChargeDialog()
											// 刷新列表
											that.filmDramaMember()
											// 购买剧集
											setTimeout(function() {
												// 数据加载完毕，关闭加载中的Toast
												that.onCheckIsCanPlay()
												// uni.hideLoading();
												// 执行其他逻辑...
											}, 2000); // 假设这里是异步加载数据，3秒后完成
										} else {
											uni.showToast({
												icon: 'error',
												title: '支付失败，请联系管理员'
											})
										}
									})
								// 刷新列表
							},
							fail({
								errMsg,
								errCode
							}) {
								console.error(errMsg, errCode)
								uni.showToast({
									icon: 'error',
									title: this.$t('toast.pay_cancel')
								})
							},
						})
					} else {
						console.log('当前用户的客户端版本不支持 wx.requestVirtualPayment')
					}
				})
			},
			// 调用getInfo()方法获取剧相关信息
			buySkit() {
				PlayletManager.setFreeList({
					list: [{
						start_serial_no: 1,
						end_serial_no: 10
					}], // 1~10集是免费剧集
				})
			},
			// 查询会员信息
			filmDramaMember() {
				var data = {
					memberId: uni.getStorageSync('id'),
				}
				// console.log(memberId,"memberId")
				// return 
				this.$request('player.filmDramaMember', data).then(res => {
					console.log("res:查询会员信息------------------------------------------------------------", res, )
					this.falishui = res.result
				})
			},
			// 查询本集余额以及剧目总额数充值套餐列表
			certerList() {
				const pm = this.getPlayerManager()
				const {
					dramaId
				} = pm.getInfo()
				console.log("1111111111111111", this.serialNos)
				var data = {
					dramaId,
					dramaSeries: this.serialNos,
					sysOrgCode: api.sysOrgCode,
					tenantId: api.tenantId,
					id: uni.getStorageSync('id')
				}
				this.$request('player.rechargePackageList', data).then(res => {
					this.mainList = res.result
				})
			},
			getWxCode(callback) {
				wx.login({
					success: (res) => {
						if (res.code) {
							this.userCode = res.code;
							if (callback) {
								callback(this.userCode);
							}
						} else {
							console.log('获取失败！' + res.errMsg);
						}
					}
				});
			},
			// 虚拟支付代币充值
			async matbBtotton(index, item) {
				this.$emit('monchang', 1);
				return
				// const userCode = await new Promise((resolve, reject) => {
				// 	this.getWxCode((userCode) => {
				// 		resolve(userCode); // 将 userCode 传递给 Promise 的 resolve 函数
				// 	});
				// });
				let that = this;
				that.ativoeIndex = index
				var data = {
					rechargeId: item.id, //充值套餐id
					memberId: uni.getStorageSync('id'), //会员id
					sysOrgCode: api.sysOrgCode, //小程序id
					tenantId: api.tenantId, //运营主体公司id
					platformType: 2,
					payMethod:'wxpay',
					openId:this.openid
				}
				// const pm = that.getPlayerManager()
				that.$request('player.rechargePackage', data).then(res => {
					console.log('充值代币', res)
					that.monbtnonve(res)
					return
					wx.requestVirtualPayment({
						signData: JSON.stringify(res.result.signData),
						// signData: JSON.stringify({
						// 	offerId: '123', //在米大师侧申请的应用 id, mp-支付基础配置中的offerid
						// 	buyQuantity: 1, //购买数量
						// 	env: 1, //环境配置, 0 米大师正式环境, 1 米大师沙箱环境, 默认为 0
						// 	currencyType: 'CNY', //人民币
						// 	productId: 'testproductId', //道具ID
						// 	goodsPrice: 10, //道具单价(分)
						// 	outTradeNo: 'xxxxxx', //业务订单号
						// 	attach: 'testdata', //透传数据, 发货通知时会透传给开发者
						// }),
						paySig: res.result.paySig, //支付签名
						signature: res.result.signature, // 用户态签名
						mode: res.result.mode, //支付类型 道具直购：short_series_goods	代币充值：short_series_coin	
						success() {
							console.log('会员开通成功，准备支付回调', res)
							console.log('会员开通成功，准备支付回调', res.result.signData.outTradeNo)
							// return
							// const outTradeNo = res.result.signData.outTradeNo
							var dataToSend = {
								attach: res.result.signData.attach,
								buyQuantity: res.result.signData.buyQuantity,
								currencyType: res.result.signData.currencyType,
								env: res.result.signData.env,
								goodsPrice: res.result.signData.goodsPrice,
								offerId: res.result.signData.offerId,
								outTradeNo: res.result.signData.outTradeNo,
								productId: res.result.signData.productId
							};
							// 支付成功回调
							that.$request('virtualPayment.virtualPaymentNotifyUrl', dataToSend).then(
								res => {
									console.log('支付回调数据', res.code)
									if (res.success) {
										uni.showToast({
											icon: 'success',
											title: '充值成功'
										})
										// pm.hideChargeDialog()
										// 刷新列表
										that.filmDramaMember()
										// 购买剧集
										setTimeout(function() {
											// 数据加载完毕，关闭加载中的Toast
											that.onCheckIsCanPlay()
											// uni.hideLoading();
											// 执行其他逻辑...
										}, 2000); // 假设这里是异步加载数据，3秒后完成
									} else {
										uni.showToast({
											icon: 'error',
											title: '支付失败，请联系管理员'
										})
									}
								})
							// 刷新列表
						},
						fail({
							errMsg,
							errCode
						}) {
							console.error(errMsg, errCode)
							uni.showToast({
								icon: 'error',
								title: this.$t('toast.pay_cancel')
							})
						},
					})
				})
			},
			monbtnonve(res){
				// 是微信浏览器
				  // 使用微信支付
				  let self = this;
				  jweixin.config({
				    //全局参数配置
				    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				    appId: res.result.appId, // 必填，公众号的唯一标识
				    timestamp: res.result.timeStamp, // 必填，生成签名的时间戳
				    nonceStr: res.result.nonceStr, // 必填，生成签名的随机串
				    signature: res.result.paySign, // 必填，签名，见附录1
				    jsApiList: ["chooseWXPay"], // 必填
				  });
				  jweixin.ready(function () {
				    //预请求，看能否发起微信支付
				    jweixin.checkJsApi({
				      //判断当前版本是否支持指定js接口
				      jsApiList: ["chooseWXPay"], // 需要检测的JS接口列表
				      success: function (res) {
				        console.log("成功信息1");
				        console.log(res);
				      },
				      fail: function (res) {
				        console.log("失败信息1");
				        console.log(res);
				      },
				    });
				
				    jweixin.chooseWXPay({
				      //发起一个微信的支付请求
				      timestamp: res.result.timeStamp, // 支付签名时间戳
				      nonceStr: res.result.nonceStr, // 支付签名随机串，不长于 32 位
				      package: res.result.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
				      signType: res.result.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
				      paySign: res.result.paySign, // 支付签名,与签名是一个东西
				      success: async function (res) {
				        console.log(res, "成功信息2");
						uni.showToast({
							icon: 'success',
							title: '充值成功'
						})
						// pm.hideChargeDialog()
						// 刷新列表
						self.filmDramaMember()
						// 购买剧集
						setTimeout(function() {
							self.$emit('monchang', 1);
							// 数据加载完毕，关闭加载中的Toast
							// self.onCheckIsCanPlay()
							// uni.hideLoading();
							// 执行其他逻辑...
						}, 2000); // 假设这里是异步加载数据，3秒后完成
				      },
				      cancel: function (res) {
				        console.log(res, "取消信息2");
				      },
				      fail: function (res) {
				        console.log(res, "失败信息2");
				      },
				    });
				  });
				
				  jweixin.error(function (res) {
				    console.log(res, "失败信息3");
				  });
			},
			// matbBtotton(index,item){
			// 	let that = this;
			// 	this.ativoeIndex = index
			// 	var data = {
			// 		rechargeId:item.id,//充值id 即是套餐id
			// 		memberId: this.falishui.id,//会员id
			// 		sysOrgCode:uni.getStorageSync('sysOrgCode'),
			// 		tenantId:'1002',
			// 	}
			// 	const pm = this.getPlayerManager()
			// 	this.$request('player.rechargePackage',data).then(res => {
			// 		console.log(res,"res:9999999999")
			// 		uni.requestPayment({
			// 			provider: 'wxpay',
			// 			timeStamp: res.result.timeStamp,
			// 			nonceStr: res.result.nonceStr,
			// 			package: res.result.package,
			// 			signType: res.result.signType,
			// 			paySign: res.result.paySign,
			// 			success: function(payRes) {
			// 				uni.showToast({
			// 					icon: 'none',
			// 					title: '支付成功',
			// 					duration:2000
			// 				})
			// 				pm.hideChargeDialog()
			// 				// 刷新列表
			// 				that.filmDramaMember()
			// 				// 购买剧集
			// 				setTimeout(function () {
			// 				    // 数据加载完毕，关闭加载中的Toast
			// 					that.onCheckIsCanPlay()
			// 				    // uni.hideLoading();
			// 				    // 执行其他逻辑...
			// 				}, 2000); // 假设这里是异步加载数据，3秒后完成
			// 				// that.getUserInfo();
			// 				// // uni.navigateTo({
			// 				// // 	url: '/pages/user/vip/vip'
			// 				// // })
			// 			},
			// 			fail: function(err) {
			// 				uni.showToast({
			// 					icon: 'none',
			// 					title: '支付取消'
			// 				})
			// 				uni.navigateTo({
			// 					url: '/pages/user/vip/vip'
			// 				})
			// 			}
			// 		})
			// 	})
			// },

			initChargeDialog() {
				// 如果播放器页面还没有playerId，返回
				if (!this.data.playerId) return
				// 只需要初始化一次
				if (this.data._isInitChargeDialog) return
				this.data._isInitChargeDialog = true
				const pm = this.getPlayerManager()
				if (pm) {
					// 注册弹窗显示事件
					pm.onShowChargeDialog(this.onShowChargeDialog.bind(this))
					// 注册弹窗隐藏事件
					pm.onHideChargeDialog(this.onHideChargeDialog.bind(this))
				}
			},
			getPlayerManager() {
				return plugin.PlayletManager.getPageManager(this.data.playerId)
			},
			onShowChargeDialog() {
				console.log('onShowChargeDialog')
				// 根据已有的参数初始化下弹窗
				this.setData({
					chargeList: [{
						name: '充100得1.3千币'
					}, {
						name: '充300得5千币'
					}, {
						name: '充500得6千币'
					}]
				})
			},
			onHideChargeDialog() {
				console.log('onHideChargeDialog')
			},
			onSelectChargeItem(e) {
				const {
					index
				} = e.currentTarget.dataset
				console.log('onSelectChargeItem index', index)
				this.setData({
					selectIndex: index
				})
			},
			onClose() {
				const pm = this.getPlayerManager()
				pm.hideChargeDialog()
			},
			onCheckIsCanPlay() {
				// var serialNo = param.serialNo
				// this.pm.showChargeDialog()
				// return this.pm.showChargeDialog()
				const pm = this.getPlayerManager()
				const {
					dramaId,
					serialNo
				} = pm.getInfo()
				// TODO: 碰到不可以解锁的剧集，会触发此事件，这里可以进行扣币解锁逻辑，如果用户无足够的币，可调用下面的this.isCanPlay设置
				// 获取需要解锁的剧集ID
				this.getEncryptData({
					serialNo: serialNo,
				}).then(res => {
					// encryptedData是后台加密后的数据，具体实现见下面的加密章节
					pm.isCanPlay({
						data: res.encryptedData,
						serialNo: serialNo,
					})
					// 从加密的数据中获取可以播放结束剧集ID，在这个基础上加1后就是要解锁的剧集，这样可以实现不管用户点击的是
					const seriesSeries = parseInt(res.end_serial_no) + 1;
					if (seriesSeries < parseInt(serialNo)) {
						console.log("serialNo222222222222222222222222222222222222222", serialNo);
						uni.showToast({
							title: this.$t('toast.please_unlock') + seriesSeries + '集',
							icon: 'success',
							duration: 2000
						});
						return
					}
					console.log("seriesSeries222222222222222222222222222222222222222", seriesSeries);
					// 调用购买剧集接口
					uni.showLoading({
						title: '解锁中...',
						mask: true // 是否显示遮罩，隐藏触摸操作
					});
					uni.request({
						url: MYurl + '/api/wxApi/buyDramaSeries',
						// url: 'http://47.120.46.16/api/wxApi/buyDramaSeries',
						method: 'POST',
						header: {
							'content-type': 'application/json', // 添加 content-type
							"X-Tenant-Id": api.tenantId,
						},
						data: {
							memberId: uni.getStorageSync('id'), //用户ID
							dramaId: dramaId, //剧集ID
							sysOrgCode: api.sysOrgCode, //部门ID
							tenantId: api.tenantId, //租户ID
							seriesSeries: seriesSeries, //解锁的剧集ID
							unlockState: false //剧集是否解锁状态
						},
						success: (res) => {
							console.log(res, '唤起余额充值组件')
							// 如果余额充足,则提示购买成功
							if (res.data.code != 600) {
								uni.showToast({
									title: res.data.message,
									icon: 'success',
									duration: 2000,
									position: 'top'
								});
								this.getEncryptData({
									serialNo: serialNo,
								}).then(res => {
									// 购买成功之后重新获取后台加密后的数据
									pm.isCanPlay({
										data: res.encryptedData,
										serialNo: serialNo,
									})
									uni.hideLoading();
									// pm.hideChargeDialog()
									this.certerList()
								})
							} else {
								pm.ShowChargeDialog()
								this.certerList()
								// 我没钱了
								console.log('我没钱了1111111111111111111111111111111111111111')
								uni.showToast({
									title: res.data.message,
									icon: 'error',
									duration: 2000
								});
							}
						}
					})
				})
			},
			getEncryptData() {
				const pm = this.getPlayerManager()
				// TODO: 此接口请求后台，返回下面的setCanPlaySerialList接口需要的加密参数
				const {
					srcAppid,
					dramaId,
					codes
				} = pm.getInfo()
				// console.log('getEncryptData start', srcAppid, dramaId, serialNo)

				return new Promise((resolve, reject) => {
					var codes = ''
					uni.login({
						provider: "weixin",
						success(res) {
							console.log(res)
							uni.request({
								// url: MYurl + '/api/noauth/encrypt/demo',
								url: MYurl + '/api/wxApi/selectUnlockRegion',
								method: 'GET',
								data: {
									memberId: uni.getStorageSync('id'),
									dramaId: dramaId,
									sysOrgCode: api.sysOrgCode,
									tenantId: api.tenantId,
									code: res.code,
								},

								success: (res) => {
									// console.log('videoPlayer getCanPlayList res', res.data
									// 	.result.encryptData)
									resolve({
										encryptedData: res.data.result.encryptData,
										start_serial_no: res.data.result.freeList[0]
											.start_serial_no,
										end_serial_no: res.data.result.freeList[0]
											.end_serial_no
									})
									return
								},
								fail: (fail) => {
									reject(fail)
								}
							})
						}
					})

				})
			},
		}

	}
</script>

<style lang="scss" scoped>
	@import 'recharge.scss'
</style>
