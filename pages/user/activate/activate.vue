<template>
	<view class="act">
		<!-- <view class="act_money">
			<view class="money" :style="{width:width}" @click="selectMember(index,item)"
				v-for="(item,index) in memberList" :key="index" :class="{ 'active': activeIndex === index }">
				<u-cell :border="false">
					<view slot="title">
						<view class="core">
							<view class="top">
								<view class="left">
									{{item.packageMoney}}元
								</view>
								<view class="right">
									<u--text :text="'原价'+item.packagePrice+'元'" :size="13" :decoration="linethrough"
										color="#c6c6c6"></u--text>
								</view>
							</view>
							<view class="bottom">
								{{item.packageDescribe}}
							</view>
						</view>
					</view>
				</u-cell>
			</view>
		</view> -->
		<!-- #ifndef MP-WEIXIN -->
		<!-- <view class="paytype">
			<view class="box" :class="item.value == payDefValue ? 'active':''" v-for="item in payType"
			<view class="box" :class="item.value == payDefValue ? 'active':''" v-for="item in payType"
				@click="clickPayBtn(item.value)">
				<u-icon :name="item.icon" :color="item.color" class="icon" size="26"></u-icon>
				<text class="font">{{item.name}}</text>
			</view>
		</view> -->
		<!-- #endif -->
		<!-- <WenTag :memberlist="memberList" @active="handleToActive" @activepay="handleToactivePay" :width="width"
			:linethrough="linethrough" :activeIndex="activeIndex" :activeIndexPay="activeIndexPay"></WenTag> -->
		<view class="activate_t">
			<image src="/static/images/Frame1000001588.png" mode=""></image>
			<view>
				<span>Visitor</span><br>
				Thành viên chưa mở
			</view>
		</view>
		<view class="act_equity">
			<view class="equity_title">
				Thành viên xem phim miễn phí
			</view>
			<view class="rechargeView_list">
				<view class="rechargeView_lists top1">
					<image src="/static/images/002.png" mode=""></image>
					<view class="rechargeView_cen">+600vàng</view>
					<view class="rechargeView_bottom">$320.00</view>
				</view>
				<view class="rechargeView_lists top2">
					<image src="/static/images/003.png" mode=""></image>
					<view class="rechargeView_cen">+600vàng</view>
					<view class="rechargeView_bottom">$320.00</view>
				</view>
				<view class="rechargeView_lists top3">
					<image src="/static/images/001.png" mode=""></image>
					<view class="rechargeView_cen">+600vàng</view>
					<view class="rechargeView_bottom">$320.00</view>
				</view>
			</view>
			<!-- <view class="equity">
				<view class="equity_box" v-for="(item,index) in equityList" :key="index">
					<view class="equity_left">
						<image class="img" :src="item.equityIcon" mode="aspectFit"></image>
					</view>
					<view class="equity_right">
						<view class="right_title">
							{{item.equityName}}
						</view>
						<view class="right_text">
							{{item.equityDescribe}}
						</view>
					</view>
				</view>
			</view> -->
		</view>
		<view class="act_but">
			<button class="but" @click="handleToActive">Mở thành viên</button>
		</view>
		<view class="act_prompt">
			<view>Vui lòng đọc kỹ các điều khoản sau trước khi mua</view>
			1. Để trở thành thành viên, người dùng phải điền đầy đủ, chính xác và đầy đủ thông tin đăng ký theo quy trình đăng ký do Nền tảng cung cấp, bao gồm nhưng không giới hạn ở tên người dùng, mật khẩu, thông tin chứng minh thư hợp lệ, địa chỉ email, số điện thoại di động, v.v.
			<br>
			<br>2. Người dùng cam kết rằng thông tin đăng ký mà họ cung cấp là trung thực và hợp lệ và tự chịu trách nhiệm về mọi hậu quả phát sinh từ việc cung cấp thông tin sai lệch.
			<br>
			<br>3. Nền tảng có quyền xem xét đơn đăng ký của người dùng và có quyền từ chối hoặc đình chỉ việc phê duyệt đơn đăng ký, đặc biệt đối với các ứng dụng có thể vi phạm luật pháp và quy định, quy tắc của Nền tảng hoặc có nguy cơ bảo mật.
			<br>
			<br>4. Người dùng được coi là đồng ý với tất cả các điều khoản của Ghi chú này và trở thành thành viên của Nền tảng này sau khi hoàn tất đăng ký và kích hoạt Tài khoản.
			<!-- <view class="pro_title">
				温馨提示
			</view>
			<view class="text">
				1.充值的开通的VIP会员仅限于本剧场使用。
			</view>
			<view class="text">
				2.在播剧目总数：<span class="tt">{{videoList.length || 0}}</span>。
			</view>
			<view class="text">
				3.开通VIP会员前，请先阅读<navigator url="/pages/user/about/about" hover-class="navigator-hover">
					<span class="tt">《会员服务协议》</span>。
				</navigator>
			</view>
			<view class="text">
				4.未满18周岁的未成年人应在法定监护人同意后进行充值。
			</view>
			<view class="text">
				5.充值的VIP属于虚拟商品，不支持退换。
			</view>
			<view class="text">
				6.开通VIP会员代表您已同意<navigator url="/pages/user/about/about" hover-class="navigator-hover">
					<span class="tt">《用户协议》</span>和<span class="tt">《隐私政策》</span>.
				</navigator>
			</view> -->
		</view>
		
		<!-- 统一支付组件，注意：vue3下ref不可以等于组件名，因此这里ref="pay" 而不能是 ref="uniPay" -->
		<uni-pay ref="pay" :adpid="adpid" return-url="/pages/order-detail/order-detail" logo="/static/logo.png"
			@success="onSuccess" @create="onCreate"></uni-pay>
	</view>
</template>

<script>
	import apiMoen from '../../../utils/config.js';
	const jweixin = require('jweixin-module')
	import WenTag from '../../../components/tag-select/tag-select.vue'
	export default {
		components: {
			WenTag
		},
		data() {
			return {
				// #ifdef APP-PLUS || H5
				payDefValue: "alipay",
				// #endif

				// #ifdef MP-WEIXIN
				payDefValue: 'wxpay',
				// #endif
				selectMemberVip: '',

				total_fee: 1, // 支付金额，单位分 100 = 1元
				order_no: "", // 业务系统订单号（即你自己业务系统的订单表的订单号）
				out_trade_no: "", // 插件支付单号
				description: "测试订单", // 支付描述
				type: "test", // 支付回调类型 如 recharge 代表余额充值 goods 代表商品订单（可自定义，任意英文单词都可以，只要你在 uni-pay-co/notify/目录下创建对应的 xxx.js文件进行编写对应的回调逻辑即可）
				// qr_code: true, // 是否强制使用扫码支付
				openid: "", // 微信公众号需要
				custom: {
					a: "a",
					b: 1
				},
				adpid: "1000000001", // uni-ad的广告位id

				payType: [{
					name: "支付宝",
					value: "alipay",
					color: "#1578FF",
					icon: "zhifubao"
				}, {
					name: "微信",
					value: "wxpay",
					color: "#04C15F",
					icon: "weixin-fill"
				}],
				memberList: [],
				equityList: [],
				width: '100%',
				linethrough: 'line-through',
				tenantId: null,
				sysOrgCode: null,
				activeIndex: 0,
				activeIndexPay: 0,
				userCode: '',
				videoQuery: {
					tenantId: uni.getStorageSync('tenantId'),
					sysOrgCode: uni.getStorageSync('sysOrgCode'),
					dramaClassify: "", //短剧分类
					dramaChannel: "", //频道分类
				},
				videoList: []
			};
		},
		onLoad() {
			this.tenantId = uni.getStorageSync('tenantId')
			this.sysOrgCode = uni.getStorageSync('sysOrgCode')
			this.getVipPackageList(this.tenantId, this.sysOrgCode)
			this.handleToEquityList(this.tenantId, this.sysOrgCode)
			// this.getWxCode()
			this.getVideoList()
			this.selectMember()
		},
		methods: {
			//选择支付类型
			clickPayBtn(value) {
				this.payDefValue = value
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
			// VIP充值套餐列表
			getVipPackageList(tenantId, sysOrgCode) {
				this.$request('wchatapi.vipPackageList', {
					tenantId,
					sysOrgCode
				}).then(res => {
					console.log(res, "res1111111充值套餐列表");
					if (res.code == 200) {
						this.memberList = res.result
					}
				}).catch(res => {
					console.log(res);
				})
			},
			// 获取用户选择数据
			selectMember(index, item) {
				this.activeIndex = index;
				this.selectMemberVip = item
				console.log(index, item.id);
				console.log(item, "item列表");
			},
			// 微信支付/支付宝支付
			handleToActive() {
				// console.log("获得的数据",res);
				if (this.selectMemberVip == undefined) {
					uni.showToast({
						icon: 'none',
						title: '请先选择开通会员套餐'
					})
				}else{
					var data = {
						rechargeId: this.selectMemberVip.id, //充值id 即是套餐id
						memberId: uni.getStorageSync('id'), //会员id
						sysOrgCode:  uni.getStorageSync('sysOrgCode'), //部门id
						tenantId: uni.getStorageSync('tenantId'), //运营主体公司id
						platformType: 2,//1-APP支付,1-JSAPI支付,2-Native支付,3-H5支付
						payMethod:'wxpay',
						openId:uni.getStorageSync('openid'),
						runProgramType:2 //支付平台类型(1.小程序,2.公众号)
					}
					this.$request('wchatapi.rechargeVip', data).then(res => {
						console.log("res获得的数据", res);
						this.monbtnonve(res)
						return
						this.order_no = `test` + Date.now();
						this.out_trade_no = `${this.order_no}-1`;
						// 发起支付
						this.$refs.pay.createOrder({
							provider: this.payDefValue, // 支付供应商
							total_fee: this.selectMemberVip.packageMoney * 100, // 支付金额，单位分 100 = 1元（注意：因为是前端传的，此参数可能会被伪造，回调时需要再校验下是否和自己业务订单金额一致）
							order_no: this.order_no, // 业务系统订单号（即你自己业务系统的订单表的订单号）
							out_trade_no: this.out_trade_no, // 插件支付单号
							description: this.selectMemberVip.packageName, // 支付描述
							type: 'goods', // 支付回调类型
							qr_code: this.qr_code, // 是否强制使用扫码支付
							// openid: this.openid, // 微信公众号需要
						});
					})
				}
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
							title: '会员开通成功',
							duration:2000
						})
						// 刷新列表
						setTimeout(function() {
							uni.navigateBack({
								delta: 1
							})
						}, 2000);
				      },
				      cancel: function (res) {
				        console.log(res, "取消信息2");
						uni.showToast({
							icon: 'none',
							title: '支付取消'
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
			//支付成功的回调
			paySuccess(e) {
				this.payLoading = true;
				this.SET_CARS_LIST();
				console.log(e);
			},
			payCancel(e) {
				console.log(e);
			},
			payCreate(e) {
				console.log(e);
			},
			// 微信支付
			// handleToActive(index, item) {
			// 	this.activeIndex = index;
			// 	console.log(index, item.id);
			// 	console.log(item, "item列表");

			// 	var data = {
			// 		rechargeId:item.id,//充值id 即是套餐id
			// 		memberId: uni.getStorageSync('id'),//会员id
			// 		sysOrgCode:uni.getStorageSync('sysOrgCode'),
			// 		tenantId: this.tenantId,
			// 	}
			// 	this.$request('wchatapi.rechargeVip',data).then(res => {
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
			// 					title: '支付成功'
			// 				})
			// 				// 刷新列表
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
			// getWxCode(callback) {
			// 	wx.login({
			// 		success: (res) => {
			// 			if (res.code) {
			// 				this.userCode = res.code;
			// 				if (callback) {
			// 					callback(this.userCode);
			// 				}
			// 			} else {
			// 				console.log('获取失败！' + res.errMsg);
			// 			}
			// 		}
			// 	});
			// },
			// 虚拟支付
			// async handleToActive(index, item) {
			// 	const userCode = await new Promise((resolve, reject) => {
			// 		// this.getWxCode((userCode) => {
			// 		// 	resolve(userCode); // 将 userCode 传递给 Promise 的 resolve 函数
			// 		// });
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
			// 		buyQuantity: 1, //购买数量
			// 		goodsPrice: item.packageMoney, //充值金额
			// 		productId: item.id, //充值会员id 即是套餐id
			// 		memberId: uni.getStorageSync('id'), //会员id
			// 		sysOrgCode: uni.getStorageSync('sysOrgCode'), //小程序id
			// 		tenantId: this.tenantId, //运营主体公司id
			// 		code: userCode
			// 	}
			// 	this.$request('virtualPayment.virtualPaymentVip', data).then(res => {
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
			// 									title: '会员开通成功'
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
				console.log(index);
			},

			handleToEquityList(tenantId, sysOrgCode) {
				this.$request('wchatapi.vipEequityList', {
					tenantId,
					sysOrgCode
				}).then(res => {
					if (res.code == 200) {
						this.equityList = res.result
					}
				}).catch(res => {
					console.log(res);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	// .paypage {
	// 	padding: 30rpx;

	// 	.goodsList {
	// 		margin-top: 30rpx;
	// 	}

	// 	.paytype {
	// 		// @include flex-box();

	// 		.box {
	// 			width: 49%;
	// 			height: 75rpx;
	// 			background: #fff;
	// 			border-radius: 10rpx;
	// 			// @include flex-box-set();
	// 			border: 1px solid #fff;
	// 			filter: grayscale(100%);

	// 			.font {
	// 				padding-left: 10rpx;
	// 			}
	// 		}

	// 		.box:first-child.active {
	// 			border-color: #1578FF;
	// 			color: #1578FF;
	// 			filter: grayscale(0%);
	// 		}

	// 		.box:last-child.active {
	// 			border-color: #04C15F;
	// 			color: #04C15F;
	// 			filter: grayscale(0%);
	// 		}
	// 	}

	// 	.payTabbar {
	// 		position: fixed;
	// 		width: 100%;
	// 		bottom: 0;
	// 		left: 0;
	// 	}
	// }
	.paytype {
		display: flex;
		// background-color: #333;
		justify-content: space-between;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		align-items: center;

		.box {
			display: flex;
			line-height: 75rpx;
			align-items: center;
			/* 子元素垂直居中 */
			justify-content: center;
			/* 子元素水平居中 */
			width: 49%;
			height: 75rpx;
			background: #fff;
			border-radius: 10rpx;
			background-color: #f2f5f7;
			// @include flex-box-set();
			border: 1px solid #fff;
			filter: grayscale(100%);

			.font {
				padding-left: 10rpx;
			}
		}

		.box:first-child.active {
			border-color: #1578FF;
			color: #1578FF;
			filter: grayscale(0%);
		}

		.box:last-child.active {
			border-color: #04C15F;
			color: #04C15F;
			filter: grayscale(0%);
		}
	}

	.act {
		width: 90%;
		margin: auto;

		&_equity {
			.equity {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;


				&_title {
					margin-top: 25rpx;
					color: #888888;
				}

				&_box {
					margin-top: 25rpx;
					width: 330rpx;
					height: 140rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					background-color: #F2F2F2;
					border-radius: 18rpx;

					.right_title {
						font-size: 32rpx;
						color: #333;
					}

					.right_text {
						font-size: 24rpx;
						color: $uni-text-color-grey;
					}
				}

				.equity_left {
					border-radius: 50%;
					width: 68rpx;
					height: 68rpx;
					background-color: $uni-color-success;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-right: 15rpx;
					margin-left: 28rpx;

					.img {
						width: 40rpx;
						height: 40rpx;
					}
				}
			}
		}

		&_prompt {
			margin-top: 25rpx;
			padding: 20rpx;

			.pro_title {
				color: #333;
				margin-bottom: 25rpx;
				font-size: 28rpx;
			}

			.text {
				font-size: 24rpx;
				color: #999;
				margin-bottom: 12rpx;
				display: flex;
			}

			.tt {
				// font-weight: bold;
				color: $uni-color-error;
			}
		}

		&_but {
			margin-top: 25rpx;
			padding-bottom: 25rpx;

			.but {
				background-color: #FF0066;
				color: white;
				height: 60rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}

	.active {
		// border: 1px solid #ff0066 !important;
		background-color: #f2f5f7;
	}

	.activepay {
		border: 1px solid #ff0066 !important;
	}

	.act_money {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.money {
			border: 1px solid $uni-color-bgc;
			margin-top: 15rpx;
			border-radius: 10rpx;

			.core {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
			}

			.top {
				display: flex;
				align-items: flex-end;

				.left {
					font-weight: bold;
					font-size: 34rpx;
				}

				.right {
					margin-left: 10rpx;
				}
			}

			.bottom {
				margin-top: 10rpx;
				font-size: 22rpx;
				color: #686868;
			}
		}
	}

	.act_pay {
		margin-top: 15rpx;

		.pay_box {
			margin-top: 15rpx;
			width: 50%;
			height: 80rpx;
			border: 1px solid black;
			border-radius: 8rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.pay_title {
			color: #888888;
		}

		.pay_text {
			font-size: 26rpx;
			color: #686868;
			margin-left: 5rpx;
		}
	}
	.act {
		width: 100%;
		padding: 0 40rpx;
		overflow: hidden;
		overflow-y: auto;
		padding-top: 40rpx;
		height: 100%;
		background-color: #000;
	}
	.act_prompt {
		
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 24rpx;
		line-height: 44rpx;
		color: #D1D1D1;
		view {
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 24rpx;
			color: #FFFFFF;
		}
	}
	.act_but {
		
		.but {
			height: 88rpx;
			background: #EDC267;
			border-radius: 62rpx;
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 28rpx;
			color: #000000;
		}
	}
	.equity_title {
		font-family: Inter, Inter;
		font-weight: bold;
		font-size: 36rpx;
		color: #D1D1D1;
	}
	.rechargeView_list {
		flex: 1;
		width: 100%;
		height: 100%;
		padding-bottom: 25rpx;
		overflow-y: auto;
		.rechargeView_lists {
			position: relative;
			float: left;
			margin-left: 3%;
			margin-right: 3%;
			text-align: center;
			margin-top: 25rpx;
			width: 44%;
			height: 160rpx;
			line-height: 53rpx;
			background: #242328;
			border-radius: 16rpx !important;
			border: 2rpx solid;
			border-image: linear-gradient(180deg, rgba(63, 62, 64, 1), rgba(163, 161, 166, 1)) 2 2;
			.rechargeView_percentage {
				position: absolute;
				z-index: 99;
				right: 0;
				top: 0;
				text-align: center;
				line-height: 40rpx;
				width: 82rpx;
				height: 40rpx;
				background: linear-gradient( 180deg, #EDC267 0%, #60D2FF 100%);
				border-radius: 0rpx 16rpx 0rpx 16rpx;
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 22rpx;
				color: #000000;
			}
			image {
				width: 96rpx;
				height: 79rpx;
				position: absolute;
				z-index: 99;
				right: 10rpx;
				bottom: 10rpx;
			}
			.rechargeView_top {
				font-family: Inter, Inter;
				font-weight: normal;
				font-size: 32rpx;
				color: #D1D1D1;
				span {
					font-size: 26rpx;
				}
			}
			.rechargeView_cen {
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 26rpx;
				color: #FFCD03;
			}
			.rechargeView_bottom {
				background: #3F3E40;
				font-family: Inter, Inter;
				font-weight: normal;
				font-size: 30rpx;
				color: #D1D1D1;
			}
		}
		.rechargeView_lists.top1 {
			text-align: left;
			padding-left: 20rpx;
			padding-top: 20rpx;
			background: linear-gradient( 186deg, rgba(255,224,157,0.4) 0%, rgba(237,194,103,0) 100%);
			border-radius: 16rpx;
			border: 2rpx solid #EDC267;
			.rechargeView_bottom {
				background: transparent;
				font-family: Inter, Inter;
				font-weight: bold;
				font-size: 36rpx;
				color: #EDC267;
			}
		}
		.rechargeView_lists.top2 {
			text-align: left;
			padding-left: 20rpx;
			padding-top: 20rpx;
			background: linear-gradient( 186deg, rgba(255,148,122,0.4) 0%, rgba(255,148,122,0) 100%);
			border-radius: 16rpx;
			border: 2rpx solid #FF947A;
			.rechargeView_cen {
				color: #FF947A;
			}
			.rechargeView_top {
				color: #FF947A;
			}
			.rechargeView_bottom {
				background: transparent;
				font-family: Inter, Inter;
				font-weight: bold;
				font-size: 36rpx;
				color: #FF947A;
			}
		}
		.rechargeView_lists.top3 {
			text-align: left;
			padding-left: 20rpx;
			padding-top: 20rpx;
			background: linear-gradient( 186deg, rgba(226,122,255,0.4) 0%, rgba(226,122,255,0) 100%);
			border-radius: r;
			border: 2px solid #E27AFF;
			.rechargeView_cen {
				color: #E27AFF;
			}
			.rechargeView_top {
				color: #E27AFF;
			}
			.rechargeView_bottom {
				background: transparent;
				font-family: Inter, Inter;
				font-weight: bold;
				font-size: 36rpx;
				color: #E27AFF;
			}
		}
	}
	.activate_t {
		
		width: 100%;
		display: flex;
		image {
			width: 128rpx;
			height: 128rpx;
			border-radius: 50%;
			margin-right: 32rpx;
		}
		view {
			flex: 1;
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 26rpx;
			color: #999999;
			line-height: 50rpx;
			margin-top: 16rpx;
			span {
				font-family: Inter, Inter;
				font-weight: bold;
				font-size: 36rpx;
				color: #D1D1D1;
			}
		}
	}
</style>