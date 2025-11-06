<template>
	<view class="acc">
		<view class="acc_top"  v-if="platform == 'Android'">
			<view class="top_core">
				<view class="top_rech">
					<view class="top_number">
						{{filmDramaMember.totalBalance || 0}}
					</view>
					<view class="top_text">
						账户余额
					</view>
				</view>
				<view class="divider">

				</view>
				<view class="top_rech">
					<view class="top_number">
						{{filmDramaMember.giftsBalance || 0}}
					</view>
					<view class="top_text">
						赠送余额
					</view>
				</view>
			</view>
			<navigator url="/pages/user/recharge/recharge" hover-class="navigator-hover">
				<button type="default" class="top_btn">充值</button>
			</navigator>
			<view class="top_title">
				赠送的{{allocatRechargeList.currencyName || ''}}有限期为{{allocatRechargeList.termSetUp || 0}}天，使用时优先扣除赠送{{allocatRechargeList.currencyName  || ''}}，赠送的{{allocatRechargeList.currencyName  || ''}}超过有效期后自动置零，为避免不必要的损失，请及时看剧消费！
			</view>
		</view>

		<view class="acc_bot"  v-if="platform == 'Android'">
			<view class="bot_sub">
				<zy-segmented :values="items" :current="current" @onClickItem="onClickItem" activeColor="#e30806">
				</zy-segmented>
			</view>
			<view class="bot_list">
				<u-list @scrolltolower="scrolltolower" height="100%" v-if="current === 0">
					<u-list-item v-for="item in orderVipRechargeList" :key="item.id">
						<u-cell :border="false">
							<view class="list_left" slot="title">
								<view class="left">
									<view class="left_rech">
										充值{{item.unrealMoney}}元
									</view>
									<view class="left_time">
										{{item.generateTime}}
									</view>
								</view>
							</view>
							<view slot="value" class="list_right">
								<view class="right">
									<view class="right_gold">
										+{{item.purchaseQuantity}}{{allocatRechargeList.currencyName  || ''}}
									</view>
									<view class="right_order">
										{{item.orderSn}}
									</view>
								</view>
							</view>
						</u-cell>
						<u-cell :border="false">
							<view class="list_left" slot="title">
								<view class="left">
									<view class="left_rech">
										赠送
									</view>
									<view class="left_time">
										{{item.generateTime}}
									</view>
								</view>
							</view>
							<view slot="value" class="list_right">
								<view class="right">
									<view class="right_gold">
										+{{item.giftQuantity}}{{allocatRechargeList.currencyName  || ''}}
									</view>
									<view class="right_order">
										{{item.orderSn}}
									</view>
								</view>
							</view>
						</u-cell>
					</u-list-item>
				</u-list>
				<u-list @scrolltolower="scrolltolower" height="100%" v-if="current === 1">
					<u-list-item v-for="item in orderPayRechargeList" :key="item.id">
						<!-- <u-cell :border="false">
							<view class="list_left" slot="title">
								<view class="left">
									<view class="left_rech">
										熊币过期
									</view>
									<view class="left_time">
										{{item.payTime}}
									</view>
								</view>
							</view>
							<view slot="value" class="list_right">
								<view class="right">
									<view class="right_gold">
										-{{item.purchaseQuantity}}熊币
									</view>
									<view class="right_order">
										{{item.orderSn}}
									</view>
								</view>
							</view>
						</u-cell> -->
						<u-cell :border="false">
							<view class="list_left" slot="title">
								<view class="left">
									<view class="left_rech">
										{{item.payMethod}}
									</view>
									<view class="left_time">
										{{item.payTime}}
									</view>
								</view>
							</view>
							<view slot="value" class="list_right">
								<view class="right">
									<view class="right_gold">
										-{{item.payMoney}}{{allocatRechargeList.currencyName  || ''}}
									</view>
									<view class="right_order">
										{{item.orderSn}}
									</view>
								</view>
							</view>
						</u-cell>
					</u-list-item>
				</u-list>
			</view>
		</view>
		<view class="acc" v-if="platform == 'iOS'">
			IOS苹果用户暂不支持
		</view>
	</view>
</template>

<script>
	import zySegmented from "./components/zy-segmented-control/zy-segmented-control.vue"
	export default {
		components: {
			zySegmented
		},
		data() {
			return {
				items: ['充值记录', '消费记录'], //分段器名称
				current: 0, //分段器默认初始值
				filmDramaMember: {}, // 用户充值账户详情
				orderVipRechargeList: [], //充值记录
				orderPayRechargeList: [], //消费记录
				allocatRechargeList: {}, //充值设置信息
				platform: ''
			};
		},
		onLoad() {
			// this.tenantId = uni.getStorageSync('tenantId')
			// this.sysOrgCode = uni.getStorageSync('sysOrgCode')
			// this.memberId = uni.getStorageSync('id')
			this.getAllocatProgram()
			this.getOrderVipRechargeList()
			this.getOrderPayRechargeList()
			this.getAllocatRechargeList()
			this.getSystemInfo()
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
					this.platform = 'iOS';
				}
				console.log("输出设备平台信息systemInfo",systemInfo); // 输出设备平台信息
				console.log("输出设备平台信息",this.platform); // 输出设备平台信息
			},
			onClickItem(e) {
				this.current = e
				console.log("this.current", this.current);
			},
			// 查询充值设置
			getAllocatRechargeList() {
				this.$request('wchatapi.allocatRechargeList', {
					tenantId: uni.getStorageSync('tenantId'),
					sysOrgCode: uni.getStorageSync('sysOrgCode'),
				}).then(res => {
					if (res != 200 && res.message != "") {
						uni.showToast({
							title: res.message,
							icon: 'error',
							duration: 2000,
							position: 'center'
						});
					}
					this.allocatRechargeList = res.result
					console.log('查询充值设置:', res);
				})
			},
			// 会员信息查询
			getAllocatProgram() {
				this.$request('accountKeeper.filmDramaMember', {
					memberId: uni.getStorageSync('id'),
				}).then(res => {
					if (res != 200 && res.message != "") {
						uni.showToast({
							title: res.message,
							icon: 'error',
							duration: 2000,
							position: 'center'
						});
					}
					this.filmDramaMember = res.result
					console.log(uni.getStorageSync('id'), "uni.getStorageSync('id')");
					console.log('111111', res);
				})
			},
			// 充值余额订单列表-充值记录
			getOrderVipRechargeList() {
				this.$request('wchatapi.orderAccountRechargeList', {
					memberId: uni.getStorageSync('id'),
				}).then(res => {
					if (res != 200 && res.message != "") {
						uni.showToast({
							title: res.message,
							icon: 'success',
							duration: 2000,
							position: 'center'
						});
					}
					this.orderVipRechargeList = res.result
					console.log('排序后充值余额订单列表-充值记录', res);
				})
			},
			// 消费订单列表-消费记录
			getOrderPayRechargeList() {
				this.$request('accountKeeper.orderPayRechargeList', {
					memberId: uni.getStorageSync('id'),
				}).then(res => {
					if (res != 200 && res.message != "") {
						uni.showToast({
							title: res.message,
							icon: 'success',
							duration: 2000,
							position: 'center'
						});
					}
					this.orderPayRechargeList = res.result
					console.log('消费订单列表-消费记录', res);
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f2f5f7;
	}

	.acc_top {}

	.acc {
		padding-top: 30rpx;
		width: 100%;

		&_top {
			border-radius: 16rpx;
			width: 90%;
			height: auto;
			margin: auto;
			background-color: white;
			padding-bottom: 32rpx;

			.top_core {
				height: 200rpx;
				display: flex;
				justify-content: space-around;
				align-items: center;
			}

			.divider {
				width: 1px;
				height: 100rpx;
				background-color: #ccc;
			}

			.top_rech {
				height: 100rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-around;

			}

			.top_number {
				font-size: 40rpx;
				font-weight: bold;
			}

			.top_text {
				font-size: 26rpx;
			}

			.top_btn {
				width: 90%;
				margin: auto;
				background-color: #ff0066;
				color: white;
				font-weight: bold;
				height: 70rpx;
				line-height: 70rpx;
			}

			.top_title {
				padding-top: 20rpx;
				width: 90%;
				margin: auto;
				text-align: justify;
				font-size: 26rpx;
				color: #686868;
			}
		}

		&_bot {
			width: 90%;
			margin: auto;
			min-height: 600rpx;
			height: auto;
			background-color: white;
			margin-top: 30rpx;
			padding-bottom: 32rpx;
			margin-bottom: 32rpx;
			border-radius: 16rpx;

			.bot_sub {
				width: 60%;
				margin: auto;
			}

			.left {
				display: flex;
				flex-direction: column;
				align-items: flex-start;

				&_rech {
					font-weight: bold;
				}

				&_time {
					padding-top: 20rpx;
					font-size: 22rpx;
				}

			}

			.right {
				display: flex;
				flex-direction: column;
				align-items: flex-end;

				&_gold {
					color: #e30806;
					font-weight: bold;
				}

				&_order {
					padding-top: 20rpx;
					font-size: 22rpx;
				}
			}
		}
	}
</style>
