<template>
	<view class="centert-lsty">
		<view class="mon-list">
			<!-- <view class="moinuns-view" v-for="(item,index) in goldList.list" :class="index==activeIndex?'m-ativoe':''"
				@click="handleToActive(index,item)">
				<view class="mv-ones">
					<view class="">
						<span style="font-size: 34rpx;">{{item.packageMoney}}</span>元
					</view>
					<view class="coloir">{{item.rechargeCoins}}{{falishui.currencyName}}</view>
				</view>
				<view class="mv-two">
					额外赠送{{item.giftCoins}}{{falishui.currencyName}}
				</view>
			</view> -->
			<view class="rechargeView_title">
				<span>Số dư: 50 vàng</span>
			</view>
			<view class="rechargeView_list">
				<view class="rechargeView_lists top3">
					<span class="rechargeView_percentage">+30%</span>
					<view class="rechargeView_top">1800 vàng</view>
					<view class="rechargeView_cen">+540vàng</view>
					<view class="rechargeView_bottom">$590.00</view>
				</view>
				<view class="rechargeView_lists">
					<view class="rechargeView_top">1000 vàng</view>
					<view class="rechargeView_cen">+540vàng</view>
					<view class="rechargeView_bottom">$320.00</view>
				</view>
				<view class="rechargeView_lists">
					<span class="rechargeView_percentage">+30%</span>
					<view class="rechargeView_top">1500 vàng</view>
					<view class="rechargeView_cen">+225vàng</view>
					<view class="rechargeView_bottom">$490.00</view>
				</view>
				<view class="rechargeView_lists">
					<span class="rechargeView_percentage">+30%</span>
					<view class="rechargeView_top">2400 vàng</view>
					<view class="rechargeView_cen">+600vàng</view>
					<view class="rechargeView_bottom">$790.00</view>
				</view>
				<view class="rechargeView_lists">
					<view class="rechargeView_top">3000 vàng</view>
					<view class="rechargeView_cen">+1200vàng</view>
					<view class="rechargeView_bottom">$900.00</view>
				</view>
				
				<view class="rechargeView_lists">
					<span class="rechargeView_percentage">+30%</span>
					<view class="rechargeView_top">5000 vàng</view>
					<view class="rechargeView_cen">+2500vàng</view>
					<view class="rechargeView_bottom">$1,490.00</view>
				</view>
			</view>
		</view>
		<view class="act_prompt">
			Gợi ý:<br>
			Monkey Short cung cấp nội dung miễn phí và trả phí cho tất cả mọi người. Bạn có thể quyết định nội dung cần giải mã. Thanh toán là không bắt buộc và giá trị lưu trữ không hỗ trợ hoàn lại tiền. Nếu tiền dự trữ chưa được ghi vào tài khoản của ông, xin vui lòng thoát khỏi bang của tôi.
			<!-- <view class="bot_title">
				温馨提示
			</view>
			<view class="text">
				1.充值的{{allocatRechargeList.currencyName || ""}}仅限于本剧场使用。
			</view>
			<view class="text">
				2.1元兑换{{allocatRechargeList.proportSetUp || "100"}}{{allocatRechargeList.currencyName || ""}}，赠送的{{allocatRechargeList.currencyName || ""}},有效期为{{allocatRechargeList.termSetUp || 0}}天，有效期到后赠送{{allocatRechargeList.currencyName || ""}}置0。
			</view>
			<view class="text">
				3.充值{{allocatRechargeList.currencyName || ""}}前，请您先仔细阅读<navigator url="/pages/user/about/about"
					hover-class="navigator-hover"><span class="tt">《会员服务协议》</span>。</navigator>
			</view>
			<view class="text">
				4.未满18周岁的未成年人应在法定监护人同意后进行充值。
			</view>
			<view class="text">
				5.充值的{{allocatRechargeList.currencyName || ""}}属于虚拟商品，不支持退换。
			</view>
			<view class="text">
				6.充值代表您已同意<navigator url="/pages/user/about/about" hover-class="navigator-hover">
					<span class="tt">《用户协议》</span>和<span class="tt">《隐私政策》</span>.
				</navigator>
			</view> -->
		</view>
	</view>
</template>

<script>
	import apiMoen from '../../../utils/config.js';
	const jweixin = require('jweixin-module')
	import WenTag from '../../../components/tag-select/tag-select.vue'
	import config from '@/utils/config.js'
	export default {
		components: {
			WenTag
		},
		data() {
			return {
				goldList: [],
				width: '320rpx',
				money: '',
				tenantId: null,
				sysOrgCode: null,
				activeIndex: 0,
				activeIndexPay: 0,
				allocatRechargeList: {},
				userCode: '',
				falishui: {},
				openid:'ogvdF6U0Z36PmXdEg7QQEO6Tfh1w',
				memberId:uni.getStorageSync('memberId') || '',
			};
		},
		onLoad() {
			this.getAllocatRechargeList()
			this.tenantId = uni.getStorageSync('tenantId')
			this.sysOrgCode = uni.getStorageSync('sysOrgCode')
			this.handleToGoldList(this.tenantId, this.sysOrgCode)
			this.getRechargePackageList(this.tenantId, this.sysOrgCode)
			this.getWxCode()
			this.filmDramaMember()
		},
		methods: {
			// 查询会员信息
			filmDramaMember() {
				var data = {
					memberId: this.memberId,
				}
				// return 
				this.$request('player.filmDramaMember', data).then(res => {
					this.falishui = res.result
				})
			},
			// 查询充值设置
			getAllocatRechargeList() {
				this.$request('wchatapi.allocatRechargeList', {
					memberId: this.memberId,
					sysOrgCode: uni.getStorageSync('sysOrgCode'),
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
			// 账户充值套餐列表
			getRechargePackageList(tenantId, sysOrgCode) {
				this.$request('wchatapi.rechargePackageList', {
					tenantId,
					sysOrgCode
				}).then(res => {
					console.log(res, "res1111111账户充值套餐列表");
					if (res.code == 200) {
						this.goldList = res.result
					}
				}).catch(res => {
					console.log(res);
				})
			},
			// 充值支付
			handleToActive(index, item) {
				// uni.login({
				// 	"provider": "weixin",
				// 	"onlyAuthorize": true, // 微信登录仅请求授权认证
				// 	success: function(event) {
				// 		const {
				// 			code
				// 		} = event
				// 		// console.log('获取小程序初始化基本信息code222222222222222222')
				// 		mythis.$request('login.getOpenIdByCode', {
				// 			code: code,
				// 			sysOrgCode: uni.getStorageSync('sysOrgCode'), //盼盼短剧
				// 			// appId: 'wxd5208bc6883761bd',//迅捷剧场
				// 		}).then(res => {
				// 			console.log('获取小程序初始化基本信息我进到这儿了', res)
				// 			if (res.code == 200) {
				// 				uni.setStorageSync('openid', res.result.openid)
				// 			}
				// 		})
				// 	},
				// 	fail: function(err) {
				// 		// 登录授权失败
				// 		// err.code是错误码
				// 	}
				// })
				this.activeIndex = index;
				// console.log(index, item);
				this.money = item.money
				var data = {
					rechargeId: item.id, //充值套餐id
					memberId: this.memberId,
					sysOrgCode: uni.getStorageSync('sysOrgCode'), //租户id
					tenantId: uni.getStorageSync('tenantId'), //运营主体公司id
					platformType: 2,
					payMethod:'wxpay',
					openId:uni.getStorageSync('openid'),
					runProgramType:2//支付平台类型(1.小程序,2.公众号)
				}
				this.$request('player.rechargePackage', data).then(res => {
					console.log(res, "res:9999999999")
					this.monbtnonve(res)
					return
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: res.result.timeStamp,
						nonceStr: res.result.nonceStr,
						package: res.result.package,
						signType: res.result.signType,
						paySign: res.result.paySign,
						success: function(payRes) {
							uni.showToast({
								icon: 'none',
								title: '支付成功'
							})
							// 刷新列表
							uni.navigateBack({
								delta: 1
							})
						},
						fail: function(err) {
							uni.showToast({
								icon: 'none',
								title: '支付取消'
							})
							uni.navigateTo({
								url: '/pages/user/vip/vip'
							})
						}
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
				    appId: apiMoen.gzhAppid, // 必填，公众号的唯一标识
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
							icon: 'none',
							title: '支付成功',
							duration:2000
						})
						// 刷新列表
						setTimeout(function() {
							uni.navigateBack({
								delta: 1
							})
						}, 2000); // 假设这里是异步加载数据，3秒后完成
						
				      },
				      cancel: function (res) {
				        console.log(res, "取消信息2");
						uni.showToast({
							icon: 'none',
							title: '支付取消'
						})
						uni.navigateTo({
							url: '/pages/user/vip/vip'
						})
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
			getWxCode(callback) {
				// wx.login({
				// 	success: (res) => {
				// 		if (res.code) {
				// 			this.userCode = res.code;
				// 			if (callback) {
				// 				callback(this.userCode);
				// 			}
				// 		} else {
				// 			console.log('获取失败！' + res.errMsg);
				// 		}
				// 	}
				// });
			},
			// 虚拟支付
			// async handleToActive(index, item) {
			// 	const userCode = await new Promise((resolve, reject) => {
			// 		this.getWxCode((userCode) => {
			// 			resolve(userCode); // 将 userCode 传递给 Promise 的 resolve 函数
			// 		});
			// 	});
			// 	this.activeIndex = index;
			// 	// 目前只有 >= v2.19.2 的基础库支持该接口，后续将对更多低版本基础库支持该接口。因此建议开发者这样判断：当前用户的基础库版本 >= v2.19.2 时可以直接用 wx.requestVirtualPayment，小于 v2.19.2 时，用 wx.canIUse('requestVirtualPayment') 来判断接口是否可用。
			// 	function compareVersion(_v1, _v2) {
			// 		if (typeof _v1 !== 'string' || typeof _v2 !== 'string') return 0
			// 		const v1 = _v1.split('.')
			// 		const v2 = _v2.split('.')
			// 		const len = Math.max(v1.length, v2.length)
			// 		while (v1.length < len) {
			// 			v1.push('0')
			// 		}
			// 		while (v2.length < len) {
			// 			v2.push('0')
			// 		}
			// 		for (let i = 0; i < len; i++) {
			// 			const num1 = parseInt(v1[i], 10)
			// 			const num2 = parseInt(v2[i], 10)

			// 			if (num1 > num2) {
			// 				return 1
			// 			} else if (num1 < num2) {
			// 				return -1
			// 			}
			// 		}
			// 		return 0
			// 	}

			// 	const SDKVersion = wx.getSystemInfoSync().SDKVersion
			// 	const self = this; // 在外部保存正确的上下文
			// 	var data = {
			// 		// buyQuantity: item.packageMoney, //购买数量
			// 		// buyQuantity: 5, //购买数量
			// 		goodsPrice: item.packageMoney, //充值金额
			// 		productId: item.id, //即是套餐id
			// 		memberId: uni.getStorageSync('id'), //会员id
			// 		sysOrgCode: uni.getStorageSync('sysOrgCode'), //小程序id
			// 		tenantId: this.tenantId, //运营主体公司id
			// 		code: userCode
			// 	}
			// 	this.$request('virtualPayment.virtualPaymentPackage', data).then(res => {
			// 		console.log('充值会员', res)
			// 		if (compareVersion(SDKVersion, '2.19.2') >= 0 || wx.canIUse('requestVirtualPayment')) {
			// 			wx.requestVirtualPayment({
			// 				signData: JSON.stringify(res.result.signData),
			// 				// signData: JSON.stringify({
			// 				// 	offerId: '123', //在米大师侧申请的应用 id, mp-支付基础配置中的offerid
			// 				// 	buyQuantity: 1, //购买数量
			// 				// 	env: 1, //环境配置, 0 米大师正式环境, 1 米大师沙箱环境, 默认为 0
			// 				// 	currencyType: 'CNY', //人民币
			// 				// 	productId: 'testproductId', //道具ID
			// 				// 	goodsPrice: 10, //道具单价(分)
			// 				// 	outTradeNo: 'xxxxxx', //业务订单号
			// 				// 	attach: 'testdata', //透传数据, 发货通知时会透传给开发者
			// 				// }),
			// 				paySig: res.result.paySig, //支付签名
			// 				signature: res.result.signature, // 用户态签名
			// 				mode: res.result
			// 					.mode, //支付类型 道具直购：short_series_goods	代币充值：short_series_coin	
			// 				success() {
			// 					console.log('会员开通成功，准备支付回调', res)
			// 					console.log('会员开通成功，准备支付回调', res.result.signData.outTradeNo)
			// 					// return
			// 					// const outTradeNo = res.result.signData.outTradeNo
			// 					var dataToSend = {
			// 						attach: res.result.signData.attach,
			// 						buyQuantity: res.result.signData.buyQuantity,
			// 						currencyType: res.result.signData.currencyType,
			// 						env: res.result.signData.env,
			// 						goodsPrice: res.result.signData.goodsPrice,
			// 						offerId: res.result.signData.offerId,
			// 						outTradeNo: res.result.signData.outTradeNo,
			// 						productId: res.result.signData.productId
			// 					};
			// 					// 支付成功回调
			// 					self.$request('virtualPayment.virtualPaymentNotifyUrl', dataToSend)
			// 						.then(res => {
			// 							console.log('支付回调数据', res.code)
			// 							if (res.success) {
			// 								uni.showToast({
			// 									icon: 'success',
			// 									title: '充值成功'
			// 								})
			// 							} else {
			// 								uni.showToast({
			// 									icon: 'error',
			// 									title: '支付失败，请联系管理员'
			// 								})
			// 							}
			// 						})
			// 					// 刷新列表
			// 				},
			// 				fail({
			// 					errMsg,
			// 					errCode
			// 				}) {
			// 					console.error(errMsg, errCode)
			// 					uni.showToast({
			// 						icon: 'error',
			// 						title: '支付取消'
			// 					})
			// 				},
			// 			})
			// 		} else {
			// 			console.log('当前用户的客户端版本不支持 wx.requestVirtualPayment')
			// 		}
			// 	})
			// },

			handleToactivePay(index, item) {
				// console.log(index);
				// console.log(this.width);
			},
			handleToGoldList(tenantId, sysOrgCode) {
				this.$request('wchatapi.rechargePackageList', {
					tenantId,
					sysOrgCode
				}).then(res => {
					if (res.code == 200) {
						res.result.forEach(it => {
							it.packageMoney = it.packageMoney + '元'
							it.gold = it.actualReceipt + '熊币'
							return this.goldList.push(it)
						})
						console.log(this.goldList);
					}
				}).catch(res => {
					console.log(res);
				})
			},
		}
	}
</script>

<style lang="scss">
	@import '../../../components/charge-dialog/recharge.scss';
	// .rech {
	// 	width: 90%;
	// 	margin: auto;

	// 	.rech_bottom {
	// 		margin-top: 25rpx;
	// 		padding: 20rpx;
	// 		.bot_title {
	// 			color: #333;
	// 			margin-bottom: 25rpx;
	// 			font-size: 28rpx;
	// 		}

	// 		.text {
	// 			font-size: 24rpx;
	// 			color: #999;
	// 			margin-bottom: 12rpx;
	// 			display: flex;
	// 		}

	// 		.tt {
	// 			// font-weight: bold;
	// 			color: $uni-color-error;
	// 		}
	// 	}

	// 	.rech_but {
	// 		margin-top: 60rpx;
	// 		padding-bottom: 25rpx;

	// 		.but {
	// 			background-color: #FF0066;
	// 			color: white;
	// 			height: 60rpx;
	// 			display: flex;
	// 			justify-content: center;
	// 			align-items: center;
	// 		}
	// 	}
	// }
	// .active {
	// 	border: 1px solid #ff0066 !important;
	// 	background-color: #fff2f7;
	// }

	// .activepay {
	// 	border: 1px solid #ff0066 !important;
	// }

	// .act_money {
	// 	display: flex;
	// 	flex-wrap: wrap;
	// 	justify-content: space-between;

	// 	.money {
	// 		border: 1px solid #747474;
	// 		margin-top: 15rpx;
	// 		border-radius: 10rpx;

	// 		.core {
	// 			display: flex;
	// 			flex-direction: column;
	// 			align-items: flex-start;
	// 		}

	// 		.top {
	// 			display: flex;
	// 			align-items: flex-end;

	// 			.left {
	// 				font-weight: bold;
	// 				font-size: 34rpx;
	// 			}

	// 			.right {
	// 				margin-left: 10rpx;
	// 			}
	// 		}

	// 		.bottom {
	// 			margin-top: 10rpx;
	// 			font-size: 22rpx;
	// 			color: #686868;
	// 		}
	// 	}
	// }

	// .act_pay {
	// 	margin-top: 15rpx;

	// 	.pay_box {
	// 		margin-top: 15rpx;
	// 		width: 50%;
	// 		height: 80rpx;
	// 		border: 1px solid black;
	// 		border-radius: 8rpx;
	// 		display: flex;
	// 		justify-content: center;
	// 		align-items: center;
	// 	}

	// 	.pay_title {
	// 		color: #888888;
	// 	}

	// 	.pay_text {
	// 		font-size: 26rpx;
	// 		color: #686868;
	// 		margin-left: 5rpx;
	// 	}
	// }
</style>