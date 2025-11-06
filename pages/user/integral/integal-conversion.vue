<!--积分兑换金币-->
<template>
	<view class="app-container">
		<u-navbar title="Chuyển đổi" :autoBack="true" bgColor='transparent' :titleStyle='titleStyle'
			leftIconColor='#fff' :placeholder='true' rightText='Chi tiết' />
		<view class="remaining">
			<view class="remaining-text">Điểm của tôi</view>
			<view class="value">
				<image class="remaining-icon" src="/static/images/diamond.png" mode=""></image>
				<text class="value-text">1200</text>
			</view>
		</view>
		<view class="tips">
			100 điểm tích lũy =1 vàng
		</view>
		<view class="form">
			<u--form :model="form" ref="uForm" labelPosition='top' labelWidth='190' :borderBottom='false'
				:labelStyle='labelStyle'>
				<u-form-item label="Vui lòng nhập số điểm" prop="name" :borderBottom='false'>
					<u-input v-model="form.name" border='none' :placeholderStyle='placeholderStyle'
						placeholder='Chuyển đổi tối đa 12 vàng' />
				</u-form-item>
			</u--form>
			<u-button class="submt-btn" @click="submit">nộp</u-button>
		</view>
	</view>
</template>

<script>
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
					name: '',

				},
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: ['blur', 'change']
					}]
				},
			}
		},
		methods: {

		},
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #000;

	}

	.app-container {
		min-height: 100vh;
		background-image: url('/static/images/ navbar-bg.png');
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
			.remaining-icon{
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