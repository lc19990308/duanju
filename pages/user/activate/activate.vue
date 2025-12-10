<template>
	<view class="act">
		<u-navbar :title="$t(`member.member_title`)" :fixed='true' bgColor='transparent' :titleStyle='titleStyle'
			leftIconColor='#fff' :autoBack="true" :placeholder='true'>
		</u-navbar>
		<view class="activate_t">
			<image :src="avatar" mode=""></image>
			<view>
				<text>{{nickname}}</text><br>
			</view>
		</view>
		<view class="act_equity">
			<view class="equity_title">
				{{$t('member.member_title')}}
			</view>
			<view class="rechargeView_list">
				<view :class="['rechargeView_lists', 'top' + (index + 1),activeIndex == index ? 'active':'' ]" @click="selectMember(index,item)"
					v-for="(item,index) in memberList" :key="index">
					<image :src="item.itemUrl" mode=""></image>
					<view class="rechargeView_cen">{{item.packageName}}</view>
					<view class="rechargeView_bottom">{{$t('currency')}} {{item.packagePrice}}</view>
				</view>
			</view>
		</view>
		<view class="act_but">
			<button class="but" @click="handleToActive">{{$t(`member.btn_text`)}}</button>
		</view>
		<!-- 		<view class="equity-glass">
			<view class="eq-glass-card" v-for="(item,index) in equityList" :key="index">
				<view class="eq-title">{{item.equityName}}</view>
				<view class="eq-desc">{{item.equityDescribe}}</view>
			</view>
		</view> -->
		<view class="act_prompt">
			<view>{{$t(`member.tips_title`)}}</view>
			<view v-html="$t(`member.tips_text`)"></view>
		</view>

		<!-- 统一支付组件，注意：vue3下ref不可以等于组件名，因此这里ref="pay" 而不能是 ref="uniPay" -->
		<uni-pay ref="pay" :adpid="adpid" return-url="/pages/order-detail/order-detail" logo="/static/logo.png"
			@success="onSuccess" @create="onCreate"></uni-pay>
	</view>
</template>

<script>
	import apiMoen from '../../../utils/config.js';
	import WenTag from '../../../components/tag-select/tag-select.vue'
	export default {
		components: {
			WenTag,
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
				tenantId: apiMoen.tenantId,
				sysOrgCode: null,
				activeIndex: 0,
				activeIndexPay: 0,
				userCode: '',
				videoQuery: {
					tenantId: apiMoen.tenantId,
					sysOrgCode: apiMoen.sysOrgCode,
					dramaClassify: "", //短剧分类
					dramaChannel: "", //频道分类
					pageNo: 1,
					pageSize: 10,
				},
				videoList: [],
				titleStyle: {
					color: '#fff',
					fontFamily: 'PingFang SC, PingFang SC',
					fontWeight: 800,
					color: '#FFFFFF',
				},
				nickname: '',
				avatar: '',
				colorPool: [
					'#FF9E9E', '#A0C4FF', '#CAFFBF', '#FFD6A5', '#BDB2FF', '#C0FDFF'
				],
				equityList: []
			};
		},
		onLoad() {
			this.tenantId = apiMoen.tenantId,
				this.sysOrgCode = apiMoen.sysOrgCode,
				this.getVipPackageList(this.tenantId, this.sysOrgCode)
			this.handleToEquityList(this.tenantId, this.sysOrgCode)
			// this.getWxCode()
			this.selectMember()
			this.getUserInfo();
		},
		methods: {
			//选择支付类型
			clickPayBtn(value) {
				this.payDefValue = value
			},
			// VIP充值套餐列表
			getVipPackageList(tenantId, sysOrgCode) {
				this.$request('wchatapi.vipPackageList', {
					tenantId,
					sysOrgCode
				}).then(res => {
					if (res.code == 200) {
						this.memberList = res.result
					}
				})
			},
			// 获取用户选择数据
			selectMember(index, item) {
				this.activeIndex = index;
				this.selectMemberVip = item
			},
			// 微信支付/支付宝支付
			handleToActive() {
				if (this.selectMemberVip == undefined) {
					uni.showToast({
						icon: 'none',
						title: this.$t('toast.open_member')
					})
				} else {
					var data = {
						rechargeId: this.selectMemberVip.id, //充值id 即是套餐id
						memberId: uni.getStorageSync('id'), //会员id
						sysOrgCode: apiMoen.sysOrgCode, //部门id
						tenantId: apiMoen.tenantId, //运营主体公司id
						platformType: 2, //1-APP支付,1-JSAPI支付,2-Native支付,3-H5支付
						payMethod: 'wxpay',
						openId: uni.getStorageSync('openid'),
						runProgramType: 2 //支付平台类型(1.小程序,2.公众号)
					}
					this.$request('wchatapi.rechargeVip', data).then(res => {

						this.monbtnonve(res)
						return
						this.order_no = `test` + Date.now();
						this.out_trade_no = `${this.order_no}-1`;
						// 发起支付
						this.$refs.pay.createOrder({
							provider: this.payDefValue, // 支付供应商
							total_fee: this.selectMemberVip.packageMoney *
								100, // 支付金额，单位分 100 = 1元（注意：因为是前端传的，此参数可能会被伪造，回调时需要再校验下是否和自己业务订单金额一致）
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
			monbtnonve(res) {
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
				jweixin.ready(function() {
					//预请求，看能否发起微信支付
					jweixin.checkJsApi({
						//判断当前版本是否支持指定js接口
						jsApiList: ["chooseWXPay"], // 需要检测的JS接口列表
						success: function(res) {
							console.log("成功信息1");
							console.log(res);
						},
						fail: function(res) {
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
						success: async function(res) {
							console.log(res, "成功信息2");
							uni.showToast({
								icon: 'none',
								title: this.$t('toast.member_open_success'),
								duration: 2000
							})
							// 刷新列表
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								})
							}, 2000);
						},
						cancel: function(res) {
							console.log(res, "取消信息2");
							uni.showToast({
								icon: 'none',
								title: '支付取消'
							})

						},
						fail: function(res) {
							console.log(res, "失败信息2");
						},
					});
				});

				jweixin.error(function(res) {
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
						console.log(this.equityList, 'equityList')
					}
				}).catch(res => {
					console.log(res);
				})
			},
			getUserInfo() {
				this.$request('user.getUserInfo').then(res => {
					const result = res.result.userInfo;
					this.nickname = result.realname;
					this.avatar = result.avatar;

				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.paytype {
		display: flex;
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
		margin: auto;
		background-image: url('/static/images/navbar-bg.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		min-height: 100vh;

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
				background: linear-gradient(180deg, #EDC267 0%, #60D2FF 100%);
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

				text {
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
			background: linear-gradient(186deg, rgba(255, 224, 157, 0.4) 0%, rgba(237, 194, 103, 0) 100%);
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
			background: linear-gradient(186deg, rgba(255, 148, 122, 0.4) 0%, rgba(255, 148, 122, 0) 100%);
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
			background: linear-gradient(186deg, rgba(226, 122, 255, 0.4) 0%, rgba(226, 122, 255, 0) 100%);
			border-radius: 16rpx;
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

	/* -------------- top4 深海青柠 -------------- */
	.rechargeView_lists.top4 {
		text-align: left;
		padding-left: 20rpx;
		padding-top: 20rpx;
		background: linear-gradient(186deg, rgba(0, 255, 235, .35) 0%, rgba(0, 255, 235, 0) 100%);
		border-radius: 16rpx;
		border: 2rpx solid #00FFEB;

		.rechargeView_top {
			color: #00FFEB;
		}

		.rechargeView_cen {
			color: #00FFEB;
		}

		.rechargeView_bottom {
			background: transparent;
			font-weight: bold;
			font-size: 36rpx;
			color: #00FFEB;
		}
	}


	/* -------------- top6 星云紫蓝 -------------- */
	.rechargeView_lists.top5 {
		text-align: left;
		padding-left: 20rpx;
		padding-top: 20rpx;
		background: linear-gradient(186deg, rgba(122, 162, 255, .4) 0%, rgba(122, 162, 255, 0) 100%);
		border-radius: 16rpx;
		border: 2rpx solid #7AA2FF;

		.rechargeView_top {
			color: #7AA2FF;
		}

		.rechargeView_cen {
			color: #7AA2FF;
		}

		.rechargeView_bottom {
			background: transparent;
			font-weight: bold;
			font-size: 36rpx;
			color: #7AA2FF;
		}
	}
	.rechargeView_lists.top6 {
		text-align: left;
		padding-left: 20rpx;
		padding-top: 20rpx;
		background: linear-gradient(186deg, rgba(122, 162, 255, .4) 0%, rgba(122, 162, 255, 0) 100%);
		border-radius: 16rpx;
		border: 2rpx solid #7AA2FF;
	
		.rechargeView_top {
			color: #7AA2FF;
		}
	
		.rechargeView_cen {
			color: #7AA2FF;
		}
	
		.rechargeView_bottom {
			background: transparent;
			font-weight: bold;
			font-size: 36rpx;
			color: #7AA2FF;
		}
	}

	.rechargeView_lists.active {
		background: linear-gradient(186deg, rgba(255, 255, 255, .25) 0%, rgba(255, 255, 255, 0) 100%);
		transform: scale(0.98);
		transition: all 0.15s ease;
	}

	.rechargeView_lists.active .rechargeView_top,
	.rechargeView_lists.active .rechargeView_cen,
	.rechargeView_lists.active .rechargeView_bottom {
		color: #ffffff !important;
	}



	.activate_t {
		width: 100%;
		display: flex;
		align-items: center;

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

			text {
				font-family: Inter, Inter;
				font-weight: bold;
				font-size: 36rpx;
				color: #D1D1D1;
			}
		}
	}

	.equity-wrap {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx; // 统一间距
	}

	.equity-chip {
		width: 330rpx; // 固定小卡片宽度
		padding: 20rpx 24rpx;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, .08);
		color: #fff;

		.eq-title {
			font-size: 28rpx;
			font-weight: 600;
		}

		.eq-desc {
			font-size: 24rpx;
			opacity: .9;
			margin-top: 6rpx;
		}
	}

	.equity-glass {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
		margin-top: 32rpx;
		// padding: 24rpx 32rpx;
	}

	.eq-glass-card {
		position: relative;
		width: calc((100% - 32rpx) / 2);
		padding: 24rpx;
		border-radius: 16rpx;
		background: rgba(255, 255, 255, .06);
		backdrop-filter: blur(12rpx);
		border: 1rpx solid rgba(255, 255, 255, .08);
		box-shadow: 0 4rpx 20rpx 0 rgba(0, 0, 0, .25);
		color: #D1D1D1;

		/* 金紫微光渐变边框 */
		&::before {
			content: '';
			position: absolute;
			inset: 0;
			border-radius: 16rpx;
			padding: 1rpx;
			background: linear-gradient(135deg, #EDC267 0%, #B08AFF 100%);
			-webkit-mask:
				linear-gradient(#fff 0 0) content-box,
				linear-gradient(#fff 0 0);
			-webkit-mask-composite: xor;
			mask-composite: exclude;
		}

		.eq-title {
			font-size: 28rpx;
			font-weight: 600;
			color: #F2F2F2;
		}

		.eq-desc {
			font-size: 24rpx;
			color: #999;
			margin-top: 8rpx;
		}
	}
	
</style>