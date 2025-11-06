<template>
	<view class="app-container">
		<u-navbar title="Thay đổi tên" :autoBack="true" :placeholder='true'>
		</u-navbar>
		<view class="agreement">
			<view class="agreement-item">
				<view class="title1">ID tài khoản này sẽ không thể đăng nhập</view>
			</view>
			<view class="agreement-item">
				<view class="title">Dữ liệu tài khoản</view>
				<view class="value">
					Tất cả dữ liệu cá nhân của bạn sẽ bị xóa, bao gồm tên người dùng và email
				</view>
			</view>
			<view class="agreement-item">
				<view class="title">Quyền lợi dịch vụ</view>
				<view class="value">
					Tiền vàng, điểm và lợi ích VIP của bạn sẽ bị xóa </view>
			</view>
			<view class="agreement-item">
				<view class="title">lịch sử</view>
				<view class="value">
					Tất cả lịch sử sẽ bị xóa, bao gồm lịch sử nạp tiền và lịch sử xem</view>
			</view>
			<view class="agreement-item">
				<view class="title1">Thông tin tài khoản bên thứ ba</view>
				<view class="value"></view>
			</view>
			<view class="agreement-checked">
				<u-checkbox-group v-model="checkboxValue1" shape='circle'  activeColor='#EDC267' @change="checkboxChange">
					<u-checkbox :customStyle="{marginBottom: '8px'}" name="1" inactiveColor='#000000'>
					</u-checkbox>
				</u-checkbox-group>
				<view class="agreement-tips">
					Tôi chấp nhận rủi ro xóa và đồng ý xóa tài khoản của mình
				</view>
			</view>
			<u-button class="submt-btn" type="primary" text="Xác nhận rủi ro và xóa"></u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checkboxValue1: 1,
			}
		},
		methods: {
			checkboxChange(){},
		},
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #000000;
	}

	.agreement {
		margin-top: 38rpx;

		.agreement-item {
			display: flex;
			justify-content: space-between;
			width: 678rpx;
			margin: 0 auto;
			background: #282828;
			border-radius: 20rpx;
			border: 2rpx solid #555555;
			box-sizing: border-box;
			padding: 18rpx 34rpx;
			margin-bottom: 36rpx;

			.title {
				width: 228rpx;
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 28rpx;
				color: #D1D1D1;
			}

			.title1 {
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 28rpx;
				color: #D1D1D1;
			}

			.value {
				flex: 1;
				margin-left: 28rpx;
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 28rpx;
				color: #999999;
			}
		}
	}

	.agreement-checked {
		display: flex;
		padding: 0 57rpx 0 32rpx;
		.agreement-tips {
			width: 624px;
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 24rpx;
			color: #D1D1D1;
		}
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
	::v-deep .u-checkbox__icon-wrap--circle{
		border: 2rpx solid #EDC267 !important;
		background-color: #000 !important;
	}
</style>