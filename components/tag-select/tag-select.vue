<template>
	<view>
		<view class="act_money">
			<view class="money" :style="{width:width}" @click="handleToActive(index,item)"
				v-for="(item,index) in maxList.list" :key="index" :class="{ 'active': activeIndex === index }">
				<u-cell :border="false">
					<view slot="title">
						<view class="core">
							<view class="top">
								<view class="left">
									{{item.packageMoney}}元
								</view>
								<view class="right">
									<u--text :text="item.actualReceipt+'熊币'" :size="13" :decoration="linethrough"
										color="#c6c6c6"></u--text>
								</view>
							</view>
							<view class="bottom">
								额外赠送{{item.giftCoins}}熊币
							</view>
						</view>
					</view>
				</u-cell>
			</view>
		</view>
		<view class="act_pay">
			<view class="pay_title">
				选择支付方式
			</view>
			<view class="pay">
				<view class="pay_box" v-for="(item,index) in 1" :key="index" @click="handleToactivePay(index)"
					:class="{ 'activepay': activeIndexPay === index }">
					<view class="pay_icon">
						<u-icon size="28" name="weixin-fill" color="#19b9cc"></u-icon>
					</view>
					<view class="pay_text">
						微信支付
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/utils/config.js'
	export default {
		props: ['memberlist', 'goldlist', 'width', 'linethrough', 'activeIndex', 'activeIndexPay'],
		data() {
			return {
				maxList:[],
				type: "",
				// activeIndex:0,
				
			};
		},
		computed: {
			memberList() {
				return this.memberlist ? this.memberlist.map(item => ({
					id: item.id,
					money: item.packageMoney,
					num: item.packagePrice,
					title: item.packageDescribe
				})) : []
			},
			goldList() {
				return this.goldlist ? this.goldlist.map(item => ({
					id: item.id,
					money: item.packageMoney,
					num: item.gold,
					title: item.packageDescribe
				})) : []
			},
			selectList() {
				// if (this.memberList.length > 0) {
				// 	return this.memberList
				// }
				// var data = {
				// 	sysOrgCode:uni.getStorageSync('sysOrgCode'),
				// 	// tenantId:uni.getStorageSync('tenantId'),
				// 	tenantId:'1002',
				// 	id:uni.getStorageSync('id')
				// }
				// this.$request('player.rechargePackageList',data).then(res => {
				// 	console.log(res,"res:1212121212")
				// 	this.maxList = res.result
				// })
				// return this.maxList
			}
		},
		created() {
			this.selectList1()
		},
		methods: {
			// 充值套餐列表
			selectList1() {
				// if (this.memberList.length > 0) {
				// 	return this.memberList
				// }
				var data = {
					sysOrgCode: api.sysOrgCode,
					tenantId:api.tenantId,
					id:uni.getStorageSync('id')
				}
				this.$request('player.rechargePackageList',data).then(res => {
					this.maxList = res.result
					console.log(this.maxList,"res:1212121212")
				})
			},
			// 购买虚拟币
			handleToActive(index, item) {
				console.log("index：",index)
				console.log("item：",item)
				
				// this.activeIndex = index;
				// this.$emit('active', index, item)
				
				// let that = this;
				// uni.showLoading({
				// 	mask: true,
				// 	title: "处理中"
				// })
				// this.type = "weixin"
				// this.$request('player.rechargePackage',{
				// 	memberId:,
				// 	rechargeId:,
				// 	sysOrgCode:,
				// 	tenantId:,
				// }).then(res => {
				// 	// this.maxList = res.result
				// 	console.log(this.maxList,"res:1212121212")
				// 	uni.requestPayment({
				// 		provider: 'wxpay',
				// 		timeStamp: res.data.timeStamp,
				// 		nonceStr: res.data.nonceStr,
				// 		package: res.data.package,
				// 		signType: res.data.signType,
				// 		paySign: res.data.paySign,
				// 		success: function(payRes) {
				// 			uni.showToast({
				// 				icon: 'none',
				// 				title: '支付成功'
				// 			})
				// 			that.getUserInfo();
				// 			// uni.navigateTo({
				// 			// 	url: '/pages/user/vip/vip'
				// 			// })
				// 		},
				// 		fail: function(err) {
				// 			uni.showToast({
				// 				icon: 'none',
				// 				title: '支付取消'
				// 			})
				// 			uni.navigateTo({
				// 				url: '/pages/user/vip/vip'
				// 			})
				// 		}
				// 	})
				// })
				
			},
			handleToactivePay(index, item) {
				// this.activeIndexPay = index;
				// this.$emit('activepay', index, item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.active {
		border: 1px solid #ff0066 !important;
		background-color: #fff2f7;
	}

	.activepay {
		border: 1px solid #ff0066 !important;
	}

	.act_money {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.money {
			border: 1px solid #747474;
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
</style>