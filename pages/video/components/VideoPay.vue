
<template>
	<view class="VideoPay" :class="{ active: show }" @click="$emit('close')">
		<view class="popup" @click.stop="">
			<view class="p_head">
				<view class="left">
					<text class="text1">支持作者创作，解锁后继续阅读</text>
				</view>
				<view class="right" @click="$emit('close')">关闭</view>
			</view>
			<view class="p_text">
				<view class="left">
					<text class="text1">解锁本集：</text>
					<text class="text2">{{ price }}积分</text>
				</view>
				<view class="right">账号余额：{{ userInfoStore.usable || 0 }}积分</view>
			</view>
			<view class="p_list">
				<!-- <view class="item">
					<view class="content">
						<view class="line1">
							<text class="text1">69.9</text>
							<text class="text2">元</text>
						</view>
						<view class="line2">
							<text class="text1">6900</text>
							<text class="text2">+2500积分</text>
						</view>
					</view>
					<view class="tips">多送30元</view>
					<view class="badge">特惠</view>
				</view> -->
				<!-- <view class="item item2">
					<view class="content">
						<view class="line1">
							<text class="text1">69.9</text>
							<text class="text2">元</text>
						</view>
						<view class="line2">
							<text class="text1">解锁整部剧</text>
							<text class="text2"></text>
						</view>
					</view>
				</view> -->
				
				<view class="item" v-if="iosIsPay" v-for="(item, index) in integralData" :key="index" @click="recharge('integral', item.id, item.price)">
					<view class="content">
						<view class="line1">
							<text class="text1">{{ item.price }}</text>
							<text class="text2">元</text>
						</view>
						<view class="line2">
							<text class="text1">{{ item.original_usable }}</text>
							<text class="text2" v-if="item.give_usable">+{{ item.give_usable }}</text>
							<text class="text2">积分</text>
						</view>
					</view>
					<view class="badge" v-if="item.flag">{{ item.flag }}</view>
				</view>
				<view class="item" v-if="iosIsPay" v-for="(item, index) in vipData" :key="index" @click="recharge('member', item.id, item.price)">
					<view class="content">
						<view class="line1">
							<text class="text1">{{ item.price }}/{{ item.type_text }}</text>
						</view>
						<view class="line2">
							<text class="text2">全站爽剧免费看</text>
						</view>
					</view>
					<view class="tips">开通会员</view>
				</view>
				<view class="item item2" @click="jumpView('/pages/user/info/contact')">
					<view class="content">
						<view class="line1">
							<text class="text1">联系我们</text>
						</view>
					</view>
				</view>
				<view class="item item2" @click="gotoPage('/pages/user/integral/task')">
					<view class="content">
						<view class="line1">
							<text class="text1">免费积分</text>
						</view>
						<view class="line2">
							<text class="text1">做任务获取积分</text>
						</view>
					</view>
				</view>
			</view>
			<view class="p_info">虚拟商品购买后不可退换，青少年请在家长陪同下充值</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		name: "VideoPay",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			price: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				userInfoStore: this.$store.state.user.userInfo,
				integralData: [],
				vipData: [],
				buttonLoading: true,
			};
		},
		computed: {
			...mapGetters("user", ["token", "userInfo"]),
			...mapGetters("app", ["iosIsPay"]),
		},
		watch: {
			userInfo: {
				deep: true,
				handler: function(newValue, oldValue) {
					this.userInfoStore = newValue
				}
			},
			show(newValue, oldValue) {
				if(newValue) {
					this.token && this.getUserInfo()
				}
			},
		},
		created() {
			this.getIntegralList()
			this.getVipList()
		},
		methods: {
			...mapActions('user', ['getUserInfo']),
			gotoPage(url) {
				if(!this.token) return this.$u.toast('请先登录!')
				// #ifdef MP-WEIXIN
				if(!this.iosIsPay) return this.jumpView('/pages/user/info/contact')
				// #endif
				this.jumpView(url)
			},
			// 获取积分套餐列表
			getIntegralList() {
				this.$request('integral.list').then(res => {
					if(res.code === 1) {
						res.data.list && res.data.list.length && (this.integralData = res.data.list)
					}
				})
			},
			// 获取vip套装列表
			getVipList() {
				this.$request('user.vip').then(res => {
					if(res.code === 1) {
						res.data.list && res.data.list.length && (this.vipData = res.data.list)
					}
				})
			},
			// 充值
			recharge(type, id, price) {
				if(!this.token) return this.$u.toast('请先登录!')
				
				// #ifdef MP-WEIXIN
				if(!this.iosIsPay) return this.jumpView('/pages/user/info/contact')
				// #endif
			
				if(this.buttonLoading) {
					this.buttonLoading = false
					uni.showLoading({
						title: '开通中...',
						mask: true
					})
					
					if(type === 'integral') {
						this.$request('integral.create', {
							usable_id: id,
							total_fee: price,
							platform: this.$utils.platforms()
						}).then(res => {
							if(res.code === 1) {
								this.callPay(res.data.order_sn, 'wechat', res.data.platform)
							} else {
								this.buttonLoading = true
							}
						}).catch(err => {
							this.buttonLoading = true
						})
					} else if(type === 'member') {
						this.$request('order.create', {
							vip_id: id,
							total_fee: price,
							platform: this.$utils.platforms()
						}).then(res => {
							if(res.code === 1) {
								this.callPay(res.data.order_sn, 'wechat', res.data.platform)
							} else {
								this.buttonLoading = true
							}
						}).catch(err => {
							this.buttonLoading = true
						})
					}
				}
			},
			// 获取支付参数
			callPay(order_sn, payment, platform) {
				this.$request('common.pay', {
					order_sn,
					payment,
					platform
				}).then(res => {
					if(res.code === 1) {
						if(platform == 'H5') {
							const div = document.createElement('divpay');
							div.innerHTML = res.data.pay_data;
							document.body.appendChild(div);
						} else {
							this.pay(res.data.pay_data)
						}
					} else {
						this.buttonLoading = true
					}
				}).catch(err => {
					this.buttonLoading = true
				})
			},
			// 发起 小程序/公众号 支付
			pay(pay) {
				// #ifdef MP-WEIXIN
				uni.requestPayment({
					timeStamp: pay.timeStamp,
					nonceStr: pay.nonceStr,
					package: pay.package,
					signType: pay.signType,
					paySign: pay.paySign,
					success: success => {
						uni.showToast({
						    title: '支付成功',
							icon: 'none',
							duration: 2000
						});
						this.buttonLoading = true
						this.getUserInfo()
						uni.$emit('updateUserInfo', true)
						uni.hideLoading()
					},
					fail: fail => {
						uni.showToast({
						    title: '支付失败',
							icon: 'none',
							duration: 2000
						});
						this.buttonLoading = true
						uni.hideLoading()
					}
				})
				// #endif
				
				// #ifdef H5
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						"appId": pay.appId, // 公众号ID，由商户传入     
						"timeStamp": pay.timeStamp, // 时间戳，自1970年以来的秒数     
						"nonceStr": pay.nonceStr, // 随机串     
						"package": pay.package, // 订单详情扩展字符串
						"signType": pay.signType, // 微信签名方式：     
						"paySign": pay.paySign // 微信签名 
					},
					res => {
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							uni.showToast({
							    title: '支付成功',
								icon: 'none',
								duration: 2000
							});
							this.buttonLoading = true
							this.getUserInfo()
							uni.$emit('updateUserInfo', true)
							uni.hideLoading()
						} else {
							uni.showToast({
							    title: '支付失败',
								icon: 'none',
								duration: 2000
							});
							this.buttonLoading = true
							uni.hideLoading()
						}
					});
				// #endif
			},
		}
	}
</script>

<style lang="scss" scoped>
	.VideoPay {
		width: 100%;
		height: 100%;
		position: absolute;
		bottom: -100%;
		left: 0;
		z-index: 100;
		transition: all 0.5s;
		
		&.active {
			bottom: 0;
		}
		
		.popup {
			width: 100%;
			min-height: 60%;
			background: #000;
			border-radius: 20rpx 20rpx 0 0;
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: 1;
			color: #fff;
			padding: 0 40rpx 60rpx 40rpx;
			border-top: 2rpx solid #333;
			display: flex;
			flex-direction: column;
			
			.p_head {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				position: relative;
				padding: 30rpx 0;
				font-size: 32rpx;
				
				.left {
					flex: 1;
					display: flex;
					flex-direction: row;
					
					.text1 {
						font-weight: 700;
						line-height: 48rpx;
					}
					
					.text2 {
						font-size: 24rpx;
						color: rgba(#fff, 0.5);
						margin: 0 40rpx;
						white-space: nowrap;
						line-height: 48rpx;
					}
				}
				
				.right {
					color: #EE7F33;
					white-space: nowrap;
					margin-left: 20rpx;
				}
			}
			
			.p_text {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;
				
				.left {
					display: flex;
					flex-direction: row;
					align-items: center;
					
					.text2 {
						color: #EE7F33;
					}
				}
				
				.right {
					color: rgba(#fff, 0.7);
				}
			}
			
			.p_list {
				flex: 1;
				margin-top: 40rpx;
				display: flex;
				flex-wrap: wrap;
				align-content: flex-start;
				
				.item {
					width: calc((100% - 40rpx) / 2);
					height: 168rpx;
					border-radius: 20rpx;
					background: #fff;
					margin-bottom: 40rpx;
					position: relative;
					overflow: hidden;
					color: #000;
					display: flex;
					flex-direction: column;
					
					&:nth-child(2n) {
						margin-left: 40rpx;
					}
					
					&.item2 {
						background: #EE7F33;
						color: #fff;
					}
					
					.content {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: center;
						// align-items: center;
						
						.line1 {
							display: flex;
							flex-direction: row;
							align-items: flex-end;
							justify-content: center;
							
							.text1 {
								font-size: 40rpx;
								font-weight: 700;
							}
							
							.text2 {
								font-size: 28rpx;
							}
						}
						
						.line2 {
							font-size: 28rpx;
							display: flex;
							flex-direction: row;
							align-items: center;
							justify-content: center;
							
							.text2 {
								color: #EE7F33;
							}
						}
					}
					
					.tips {
						font-size: 28rpx;
						text-align: center;
						background: #EE7F33;
						padding: 8rpx 0;
						color: #fff;
					}
					
					.badge {
						position: absolute;
						top: -2rpx;
						right: -2rpx;
						padding: 4rpx 16rpx;
						font-size: 24rpx;
						background: #EE7F33;
						border-radius: 0 0 0 20rpx;
						color: #fff;
					}
				}
			}
			
			.p_info {
				font-size: 24rpx;
				text-align: center;
				margin-top: 20rpx;
			}
		}
	}
</style>