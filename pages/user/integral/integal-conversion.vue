<!--积分兑换金币-->
<template>
	<view class="app-container">
		<statusBar />
		<u-navbar :title="$t(`withdrawal.page_title`) " :fixed='false' :autoBack="true" bgColor='transparent' :titleStyle='titleStyle'
			leftIconColor='#fff' :placeholder='true' @rightClick="rightClick" :rightText='$t(`withdrawal.navbar_right`)' />
		<view class="remaining">
			<view class="remaining-text">{{$t(`withdrawal.card_title`)}}</view>
			<view class="value">
				<image class="remaining-icon" src="/static/images/diamond.png" mode=""></image>
				<text class="value-text">{{info.totalBalance }}</text>
			</view>
		</view>
		<view class="tips">
			{{$t(`withdrawal.card_tips`)}}
		</view>
		<view class="form">
			<u--form :model="form" ref="uForm" :rules='rules' labelPosition='top' labelWidth='190' :borderBottom='false'
				:labelStyle='labelStyle'>
				<u-form-item :label="$t(`withdrawal.cell_label`)" prop="pointQuantity" :borderBottom='false'>
					<u-input type='number' v-model="form.pointQuantity" border='none' clearable
						:placeholderStyle='placeholderStyle' :placeholder='$t(`withdrawal.cell_value`)' />
				</u-form-item>
			</u--form>
			<u-button class="submt-btn" @click="submit">{{$t(`withdrawal.btn_text`)}}</u-button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from "vuex"
	export default {
		data() {
			return {
				placeholderStyle: 'color: #666;',
				titleStyle: {
					color: '#fff',
					fontFamily: 'PingFang SC, PingFang SC',
					fontWeight: 800,
					color: '#FFFFFF',
				},
				labelStyle: {
					color: '#FFFFFF',
					fontFamily: 'Inter, Inter',
					fontWeight: 400,
					fontsize: '32rpx',
				},
				form: {
					memberId:uni.getStorageSync('id') || '',
					pointQuantity: '',
					sysOrgCode: 'A01',
				},
				rules: {
					pointQuantity: [{
						required: true,
						message: () => i18n.t('form.pointsRequired'),
						trigger: ['blur', 'change']
					}]
				},
				info: {
					exchangeId: "",
					pointQuantity: 0,
					exchangeRatio: 0,
					remainingGoldCoin: 0,
					currentPointBalance: 0,
					goldCoinCost: 0
				},
			}
		},
		computed: {
			...mapState('user', ['userInfo']),
		},
		methods: {
			getIntegral() {
				this.$request('withdraw.getBalance', {
					memberId: this.form.memberId
				}).then(res => {
					this.info = res.result;
	
				})
			},
			submit() {
				this.$refs.uForm.validate().then(res => {
					this.$request('withdraw.goldCoinExchange', this.form, true, {
						'Content-Type': 'application/x-www-form-urlencoded'
					}).then(res => {
						uni.$u.toast(this.$t('toast.msg_success'))
						this.getIntegral();
					})
				})
			},
			rightClick() {
				uni.$u.route({
					url: '/pages/user/integral/integralInfo',
					params: {

					}
				})
			},
		},
		onLoad() {
			this.getIntegral();
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #000;

	}

	.app-container {
		min-height: 100vh;
		background-image: url('/static/images/navbar-bg.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: 100% 100%;
	}

	.remaining {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 678rpx;
		padding: 49rpx 36rpx;
		margin: 18rpx auto 0 auto;
		background: linear-gradient(220deg, #181818 0%, #545454 50%, #252525 100%);
		border-radius: 40rpx;
		border: 2rpx solid #eee;

		.value {
			display: flex;
			align-items: center;
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 36rpx;
			color: #FFCD03;

			.value-text {
				margin-left: 21rpx;
			}

			.remaining-icon {
				width: 48rpx;
				height: 45rpx;
			}
		}
	}

	.remaining-text {
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 30rpx;
		color: #D1D1D1;
	}

	.tips {
		width: 678rpx;
		margin: 16rpx auto 0 auto;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 24rpx;
		color: #D1D1D1;
	}

	.form {
		margin-top: 36rpx;
		padding: 0 36rpx;
		box-sizing: border-box;
	}

	::v-deep .u-input__content {
		background: #282828;
		height: 98rpx;
		border-radius: 20rpx;
		padding: 10rpx 20rpx;
	}

	.submt-btn {
		width: 606rpx;
		height: 88rpx;
		margin: 24rpx auto 0 auto;
		line-height: 88rpx;
		text-align: center;
		background: #EDC267;
		border-radius: 62rpx;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 28rpx;
		border: 2rpx solid #EDC267;
		color: #000000;
	}

	::v-deep .u-input__content {
		background: #282828;
		border-radius: 20rpx;
		padding: 10rpx 20rpx;
	}

	::v-deep .u-navbar__content__right__text {
		font-family: PingFang SC, PingFang SC;
		font-weight: 800;
		font-size: 22rpx;
		color: #FFFFFF;
	}

	::v-deep .uni-input-input {
		color: #f7f7f7;
	}
</style>